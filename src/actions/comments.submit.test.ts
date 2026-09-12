import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";

const { limitMock, createMock, authMock, revalidateMock } = vi.hoisted(() => ({
  limitMock: vi.fn(), createMock: vi.fn(), authMock: vi.fn(), revalidateMock: vi.fn(),
}));
vi.mock("next/cache", () => ({ revalidatePath: revalidateMock }));
vi.mock("@/lib/auth", () => ({ auth: authMock }));
vi.mock("@/lib/admin", () => ({ isAdmin: vi.fn() }));
vi.mock("@/content/projects", () => ({ getCommentableSlugs: () => new Set(["research-radar"]) }));
vi.mock("@upstash/redis", () => ({ Redis: { fromEnv: vi.fn() } }));
vi.mock("@upstash/ratelimit", () => ({
  Ratelimit: class { static slidingWindow = vi.fn(); limit = limitMock; },
}));
vi.mock("@/lib/prisma", () => ({ prisma: { projectComment: { create: createMock } } }));

import { submitComment } from "./comments";

function commentForm() {
  const data = new FormData();
  data.set("projectSlug", "research-radar");
  data.set("body", "This is a useful case study.");
  return data;
}

describe("comment rate limiting", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    vi.stubEnv("DATABASE_URL", "postgresql://test:test@localhost:5432/mock");
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "https://redis.example.com");
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "test");
    authMock.mockResolvedValue({ user: { id: "test-user" } });
    limitMock.mockResolvedValue({ success: true });
  });
  afterEach(() => { vi.unstubAllEnvs(); vi.restoreAllMocks(); });

  it("persists an allowed comment using the signed-in user's limiter key", async () => {
    expect((await submitComment({ success: false, message: "" }, commentForm())).success).toBe(true);
    expect(limitMock).toHaveBeenCalledWith("test-user");
    expect(createMock).toHaveBeenCalledOnce();
  });

  it("keeps a saved comment successful when cache revalidation fails", async () => {
    revalidateMock.mockImplementationOnce(() => { throw new Error("Cache unavailable"); });
    expect(await submitComment({ success: false, message: "" }, commentForm())).toMatchObject({
      success: true, message: expect.stringContaining("Refresh the page"),
    });
    expect(createMock).toHaveBeenCalledOnce();
  });

  it.each(["exception", "timeout", "denied"])("does not write a comment after limiter %s", async (failure) => {
    if (failure === "exception") limitMock.mockRejectedValueOnce(new Error("Redis unavailable"));
    else limitMock.mockResolvedValueOnce(failure === "timeout" ? { success: true, reason: "timeout" } : { success: false });
    expect(await submitComment({ success: false, message: "" }, commentForm())).toMatchObject({
      success: false, message: expect.stringMatching(/minute/i),
    });
    expect(createMock).not.toHaveBeenCalled();
  });
});
