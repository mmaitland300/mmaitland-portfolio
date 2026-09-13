import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  send: vi.fn(), isAdmin: vi.fn(), auth: vi.fn(), create: vi.fn(),
  findUnique: vi.fn(), update: vi.fn(), revalidatePath: vi.fn(),
}));
vi.mock("resend", () => ({ Resend: class { emails = { send: mocks.send }; } }));
vi.mock("next/cache", () => ({ revalidatePath: mocks.revalidatePath }));
vi.mock("@/lib/auth", () => ({ auth: mocks.auth }));
vi.mock("@/lib/admin", () => ({ isAdmin: mocks.isAdmin }));
vi.mock("@/lib/prisma", () => ({ prisma: {
  sentEmail: { create: mocks.create },
  contactSubmission: { findUnique: mocks.findUnique, update: mocks.update },
} }));

import { replyToSubmission, sendComposeEmail } from "./admin-email";

const submissionId = "c123456789012345678901234";
const reply = () => replyToSubmission({ submissionId, subject: "Hello", body: "A reply." });
const compose = () => sendComposeEmail({ toEmail: "visitor@example.com", subject: "Hello", body: "A message." });

describe("admin email provider acceptance", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    vi.stubEnv("RESEND_API_KEY", "re_test");
    vi.stubEnv("CONTACT_FROM_EMAIL", "from@example.com");
    vi.stubEnv("CONTACT_TO_EMAIL", "owner@example.com");
    mocks.isAdmin.mockResolvedValue(true);
    mocks.auth.mockResolvedValue({ user: { id: "admin-user" } });
    mocks.findUnique.mockResolvedValue({ id: submissionId, email: "visitor@example.com" });
    mocks.send.mockResolvedValue({ data: { id: "provider-id" }, error: null });
    mocks.create.mockResolvedValue({ id: "sent-id" });
    mocks.update.mockResolvedValue({ id: submissionId });
  });
  afterEach(() => { vi.unstubAllEnvs(); vi.restoreAllMocks(); });

  describe.each([["reply", reply], ["compose", compose]] as const)("%s", (_name, action) => {
    it.each([
      { data: null, error: { name: "validation_error", message: "Rejected" } },
      { data: null, error: { name: "application_error", message: "Network failure" } },
      { data: { id: "" }, error: null },
      { data: null, error: null },
    ])("does not write sent history or mark read after provider failure: %j", async (result) => {
      mocks.send.mockResolvedValueOnce(result);
      expect(await action()).toMatchObject({ success: false, historySaved: false, markedRead: false });
      expect(mocks.create).not.toHaveBeenCalled();
      expect(mocks.update).not.toHaveBeenCalled();
      expect(mocks.revalidatePath).not.toHaveBeenCalled();
    });

    it("handles thrown provider errors without writing success state", async () => {
      mocks.send.mockRejectedValueOnce(new Error("Network unavailable"));
      expect((await action()).success).toBe(false);
      expect(mocks.create).not.toHaveBeenCalled();
      expect(mocks.update).not.toHaveBeenCalled();
    });

    it("records the accepted provider message ID", async () => {
      expect(await action()).toMatchObject({ success: true, historySaved: true });
      expect(mocks.create).toHaveBeenCalledWith({ data: expect.objectContaining({ resendMessageId: "provider-id" }) });
    });

    it("keeps provider acceptance successful with a persistence warning", async () => {
      mocks.create.mockRejectedValueOnce(new Error("Database failure"));
      expect(await action()).toMatchObject({ success: true, historySaved: false, warning: expect.stringContaining("history") });
      expect(mocks.send).toHaveBeenCalledOnce();
    });

    it("keeps provider acceptance successful if page revalidation fails", async () => {
      mocks.revalidatePath.mockImplementationOnce(() => { throw new Error("Cache unavailable"); });
      expect(await action()).toMatchObject({
        success: true, historySaved: true, warning: expect.stringContaining("could not be refreshed"),
      });
      expect(mocks.send).toHaveBeenCalledOnce();
    });

    it("requires both admin authorization and a real user ID", async () => {
      mocks.auth.mockResolvedValueOnce({ user: {} });
      expect((await action()).success).toBe(false);
      mocks.isAdmin.mockResolvedValueOnce(false);
      expect((await action()).success).toBe(false);
      expect(mocks.send).not.toHaveBeenCalled();
    });
  });

  it("reports read-flag persistence failure after an accepted reply", async () => {
    mocks.update.mockRejectedValueOnce(new Error("Database failure"));
    expect(await reply()).toMatchObject({ success: true, historySaved: true, markedRead: false, warning: expect.stringContaining("marked as read") });
  });

  it("returns a friendly failure before sending if the source message cannot be loaded", async () => {
    mocks.findUnique.mockRejectedValueOnce(new Error("Database unavailable"));
    expect(await reply()).toMatchObject({ success: false, message: expect.stringContaining("Could not load") });
    expect(mocks.send).not.toHaveBeenCalled();
    expect(mocks.create).not.toHaveBeenCalled();
    expect(mocks.update).not.toHaveBeenCalled();
  });
});
