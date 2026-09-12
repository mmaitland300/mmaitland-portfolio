/** Resend acceptance is the send gate; it does not confirm inbox delivery. */
export function requireAcceptedEmail(result: unknown): string {
  if (!result || typeof result !== "object") {
    throw new Error("Email provider returned no acceptance result.");
  }

  const response = result as { error?: unknown; data?: { id?: unknown } | null };
  if (response.error) {
    throw new Error("Email provider rejected the message.", { cause: response.error });
  }

  const id = response.data?.id;
  if (typeof id !== "string" || !id.trim()) {
    throw new Error("Email provider returned no message ID.");
  }
  return id;
}
