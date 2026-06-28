import { afterEach, describe, expect, it, vi } from "vitest";
import {
  isPrismaConnectionUnavailable,
  logOptionalDatabaseUnavailableOnce,
  resetOptionalDatabaseLogForTests,
} from "./optional-database";

describe("isPrismaConnectionUnavailable", () => {
  it("recognizes common Prisma connection failure messages", () => {
    expect(
      isPrismaConnectionUnavailable(
        new Error("Can't reach database server at `localhost:5432`")
      )
    ).toBe(true);
    expect(isPrismaConnectionUnavailable(new Error("connect ECONNREFUSED"))).toBe(
      true
    );
  });

  it("does not treat unrelated errors as database connectivity failures", () => {
    expect(isPrismaConnectionUnavailable(new Error("P2002 unique constraint"))).toBe(
      false
    );
    expect(isPrismaConnectionUnavailable("not an error")).toBe(false);
  });
});

describe("logOptionalDatabaseUnavailableOnce", () => {
  afterEach(() => {
    resetOptionalDatabaseLogForTests();
    vi.restoreAllMocks();
  });

  it("logs a non-production warning once per feature", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);

    logOptionalDatabaseUnavailableOnce("ProjectComments", "comments disabled.", "test");
    logOptionalDatabaseUnavailableOnce("ProjectComments", "comments disabled.", "test");

    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn).toHaveBeenCalledWith(
      "ProjectComments: database unavailable; comments disabled."
    );
  });

  it("uses error logging in production", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => undefined);

    logOptionalDatabaseUnavailableOnce(
      "Admin inbox persistence",
      "submission not saved.",
      "production"
    );

    expect(error).toHaveBeenCalledWith(
      "Admin inbox persistence: database unavailable; submission not saved."
    );
  });
});
