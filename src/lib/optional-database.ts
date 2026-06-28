import { Prisma } from "@prisma/client";

const loggedOptionalDatabaseFailures = new Set<string>();

export function isPrismaConnectionUnavailable(error: unknown): boolean {
  if (error instanceof Prisma.PrismaClientInitializationError) {
    return true;
  }

  if (!(error instanceof Error)) {
    return false;
  }

  return (
    error.message.includes("Can't reach database server") ||
    error.message.includes("ECONNREFUSED")
  );
}

export function logOptionalDatabaseUnavailableOnce(
  feature: string,
  detail: string,
  env: string | undefined = process.env.NODE_ENV
): void {
  const key = `${feature}:database-unavailable`;
  if (loggedOptionalDatabaseFailures.has(key)) return;
  loggedOptionalDatabaseFailures.add(key);

  const message = `${feature}: database unavailable; ${detail}`;
  if (env === "production") {
    console.error(message);
  } else {
    console.warn(message);
  }
}

export function resetOptionalDatabaseLogForTests(): void {
  loggedOptionalDatabaseFailures.clear();
}
