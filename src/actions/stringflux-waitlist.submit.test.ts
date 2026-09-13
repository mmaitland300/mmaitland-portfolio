import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";

const { sendMock, limitMock, createManyMock } = vi.hoisted(() => ({
  sendMock: vi.fn(), limitMock: vi.fn(), createManyMock: vi.fn(),
}));
vi.mock("next/headers", () => ({ headers: vi.fn(async () => new Headers()) }));
vi.mock("resend", () => ({ Resend: class { emails = { send: sendMock }; } }));
vi.mock("@upstash/redis", () => ({ Redis: { fromEnv: vi.fn() } }));
vi.mock("@upstash/ratelimit", () => ({
  Ratelimit: class { static slidingWindow = vi.fn(); limit = limitMock; },
}));
vi.mock("@/lib/prisma", () => ({ prisma: { stringFluxWaitlist: { createMany: createManyMock } } }));
vi.mock("@prisma/client", () => ({
  PrismaClient: class { constructor() { throw new Error("Real database access is forbidden in this test."); } },
}));

import { joinWaitlist } from "./stringflux-waitlist";

const initial = { success: false, message: "" };
function waitlistForm(email = "Guitarist@Example.com") {
  const data = new FormData();
  data.set("email", email);
  data.set("interest", "  Live performance  ");
  data.set("_hp", "");
  return data;
}

describe("waitlist persistence and notification lifecycle", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    vi.spyOn(console, "warn").mockImplementation(() => undefined);
    vi.stubEnv("RESEND_API_KEY", "re_test");
    vi.stubEnv("CONTACT_FROM_EMAIL", "from@example.com");
    vi.stubEnv("CONTACT_TO_EMAIL", "owner@example.com");
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "https://redis.example.com");
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "test");
    vi.stubEnv("DATABASE_URL", "postgresql://test:test@localhost:5432/mock");
    sendMock.mockResolvedValue({ data: { id: "provider-id" }, error: null });
    limitMock.mockResolvedValue({ success: true });
    createManyMock.mockResolvedValue({ count: 1 });
  });
  afterEach(() => { vi.unstubAllEnvs(); vi.restoreAllMocks(); });

  it("normalizes the unique email, saves it, and sends confirmation with the owner's reply address", async () => {
    expect((await joinWaitlist(initial, waitlistForm())).success).toBe(true);
    expect(createManyMock).toHaveBeenCalledExactlyOnceWith({
      skipDuplicates: true,
      data: { email: "guitarist@example.com", source: "stringflux-page", interest: "Live performance" },
    });
    expect(sendMock).toHaveBeenCalledTimes(2);
    expect(sendMock).toHaveBeenNthCalledWith(2, expect.objectContaining({
      to: "guitarist@example.com", replyTo: "owner@example.com",
      subject: "You're on the StringFlux waitlist",
    }));
  });

  it("does not resend any notifications for an existing signup", async () => {
    createManyMock.mockResolvedValueOnce({ count: 0 });
    expect((await joinWaitlist(initial, waitlistForm())).success).toBe(true);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("sends only the original notifications when a normalized email is submitted again", async () => {
    createManyMock.mockResolvedValueOnce({ count: 1 }).mockResolvedValueOnce({ count: 0 });
    const results = [
      await joinWaitlist(initial, waitlistForm("Guitarist@Example.com")),
      await joinWaitlist(initial, waitlistForm("guitarist@example.com")),
    ];
    expect(results).toEqual([
      expect.objectContaining({ success: true }),
      expect.objectContaining({ success: true }),
    ]);
    expect(sendMock).toHaveBeenCalledTimes(2);
  });

  it("does not notify after database failure", async () => {
    createManyMock.mockRejectedValueOnce(new Error("Database unavailable"));
    expect((await joinWaitlist(initial, waitlistForm())).success).toBe(false);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it.each(["exception", "timeout", "denied"])("fails closed on limiter %s before persistence", async (failure) => {
    if (failure === "exception") limitMock.mockRejectedValueOnce(new Error("Redis unavailable"));
    else limitMock.mockResolvedValueOnce(failure === "timeout" ? { success: true, reason: "timeout" } : { success: false });
    expect(await joinWaitlist(initial, waitlistForm())).toMatchObject({
      success: false, message: expect.stringMatching(/try again in a minute/i),
    });
    expect(createManyMock).not.toHaveBeenCalled();
    expect(sendMock).not.toHaveBeenCalled();
  });

  it.each([
    { data: null, error: { message: "Provider rejection" } },
    { data: { id: "" }, error: null },
  ])("logs rejected notifications while keeping the persisted signup successful: %j", async (result) => {
    sendMock.mockResolvedValue(result);
    expect((await joinWaitlist(initial, waitlistForm())).success).toBe(true);
    expect(sendMock).toHaveBeenCalledTimes(2);
    expect(console.error).toHaveBeenCalledTimes(2);
  });

  it("does not send confirmation without the configured reply inbox", async () => {
    vi.stubEnv("CONTACT_TO_EMAIL", "");
    expect((await joinWaitlist(initial, waitlistForm())).success).toBe(true);
    expect(sendMock).not.toHaveBeenCalled();
    expect(console.warn).toHaveBeenCalledOnce();
  });
});
