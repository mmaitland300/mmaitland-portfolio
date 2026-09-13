import {
  type EnvironmentValues,
  isAdminAuthEnvConfigured,
  isWaitlistEnvConfigured,
} from "@/lib/env";

export function isWaitlistConfigured(
  env: EnvironmentValues = process.env
): boolean {
  return isWaitlistEnvConfigured(env);
}

export function isAdminAuthConfigured(
  env: EnvironmentValues = process.env
): boolean {
  return isAdminAuthEnvConfigured(env);
}
