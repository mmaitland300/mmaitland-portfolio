import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const { sendMock, limitMock, createMock } = vi.hoisted(() => ({
  sendMock: vi.fn(), limitMock: vi.fn(), createMock: vi.fn(),
}));

vi.mock("next/headers", () => ({
  headers: vi.fn(async () => new Headers({ "x-forwarded-for": "198.51.100.2" })),
}));
vi.mock("resend", () => ({ Resend: class { emails = { send: sendMock }; } }));
vi.mock("@upstash/redis", () => ({ Redis: { fromEnv: vi.fn() } }));
vi.mock("@upstash/ratelimit", () => ({
  Ratelimit: class { static slidingWindow = vi.fn(); limit = limitMock; },
}));
vi.mock("@/lib/prisma", () => ({ prisma: { contactSubmission: { create: createMock } } }));
vi.mock("@prisma/client", async (importOriginal) => ({
  ...await importOriginal<typeof import("@prisma/client")>(),
  PrismaClient: class { constructor() { throw new Error("Real database access is forbidden in this test."); } },
}));

import { submitContact } from "./contact";

function contactForm(overrides: Partial<Record<string, string>> = {}) {
  const fd = new FormData();
  fd.set("name", overrides.name ?? "Test User");
  fd.set("email", overrides.email ?? "visitor@example.com");
  fd.set("message", overrides.message ?? "This is a valid message body for the contact form.");
  fd.set("_hp", overrides._hp ?? "");
  return fd;
}

const initial = { success: false as const, message: "" };

describe("contact delivery and rate limit failures", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    sendMock.mockResolvedValue({ data: { id: "re_msg_test" }, error: null });
    limitMock.mockResolvedValue({ success: true });
    createMock.mockResolvedValue({ id: "saved" });
    vi.stubEnv("RESEND_API_KEY", "re_test_key");
    vi.stubEnv("CONTACT_FROM_EMAIL", "from@example.com");
    vi.stubEnv("CONTACT_TO_EMAIL", "to@example.com");
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "https://redis.example.com");
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "test");
    vi.stubEnv("DATABASE_URL", "postgresql://test:test@localhost:5432/mock");
  });

  afterEach(() => { vi.unstubAllEnvs(); vi.restoreAllMocks(); });

  it("saves an inbox copy after provider acceptance", async () => {
    expect((await submitContact(initial, contactForm())).success).toBe(true);
    expect(createMock).toHaveBeenCalledOnce();
    expect(limitMock).toHaveBeenCalledWith("198.51.100.2");
  });

  it.each([
    { data: null, error: { name: "validation_error", message: "Rejected" } },
    { data: null, error: { name: "application_error", message: "Network failure" } },
    { data: { id: "" }, error: null },
    { data: { id: "   " }, error: null },
    { data: { id: "unexpected" }, error: { message: "Rejected" } },
    undefined,
  ])("rejects an unaccepted provider result without saving inbox history: %j", async (response) => {
    sendMock.mockResolvedValueOnce(response);
    expect(await submitContact(initial, contactForm())).toMatchObject({
      success: false, message: expect.stringMatching(/failed to send/i),
    });
    expect(createMock).not.toHaveBeenCalled();
  });

  it("returns failure without persistence when Resend throws", async () => {
    sendMock.mockRejectedValueOnce(new Error("Resend outage"));
    expect((await submitContact(initial, contactForm())).success).toBe(false);
    expect(createMock).not.toHaveBeenCalled();
  });

  it("keeps an accepted submission successful if optional inbox persistence fails", async () => {
    createMock.mockRejectedValueOnce(new Error("Database unavailable"));
    expect((await submitContact(initial, contactForm())).success).toBe(true);
    expect(sendMock).toHaveBeenCalledOnce();
  });

  it.each(["exception", "timeout", "denied"])("fails closed on limiter %s before sending or persisting", async (failure) => {
    if (failure === "exception") limitMock.mockRejectedValueOnce(new Error("Redis unavailable"));
    else limitMock.mockResolvedValueOnce(failure === "timeout" ? { success: true, reason: "timeout" } : { success: false });
    expect(await submitContact(initial, contactForm())).toMatchObject({
      success: false, message: expect.stringMatching(/try again in a minute/i),
    });
    expect(sendMock).not.toHaveBeenCalled();
    expect(createMock).not.toHaveBeenCalled();
  });

  it("does not call external services for a filled honeypot", async () => {
    expect((await submitContact(initial, contactForm({ _hp: "bot" }))).success).toBe(false);
    expect(limitMock).not.toHaveBeenCalled();
    expect(sendMock).not.toHaveBeenCalled();
    expect(createMock).not.toHaveBeenCalled();
  });
});
