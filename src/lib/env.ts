import { z } from "zod/v4";

const optionalTrimmedString = z.preprocess((value) => {
  if (typeof value !== "string") {
    return value;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}, z.string().optional());

const appEnvSchema = z.object({
  DATABASE_URL: optionalTrimmedString,
  DIRECT_URL: optionalTrimmedString,
  AUTH_SECRET: optionalTrimmedString,
  AUTH_GITHUB_ID: optionalTrimmedString,
  AUTH_GITHUB_SECRET: optionalTrimmedString,
  ADMIN_GITHUB_IDS: optionalTrimmedString,
  RESEND_API_KEY: optionalTrimmedString,
  CONTACT_FROM_EMAIL: optionalTrimmedString,
  CONTACT_TO_EMAIL: optionalTrimmedString,
  UPSTASH_REDIS_REST_URL: optionalTrimmedString,
  UPSTASH_REDIS_REST_TOKEN: optionalTrimmedString,
  NEXT_PUBLIC_SITE_URL: optionalTrimmedString,
  NEXT_PUBLIC_CONTACT_EMAIL: optionalTrimmedString,
  NEXT_PUBLIC_RESEARCH_RADAR_URL: optionalTrimmedString,
  VERCEL_PROJECT_PRODUCTION_URL: optionalTrimmedString,
  VERCEL_URL: optionalTrimmedString,
});

const adminAuthEnvSchema = z.object({
  DATABASE_URL: z.string().min(1),
  AUTH_SECRET: z.string().min(1),
  AUTH_GITHUB_ID: z.string().min(1),
  AUTH_GITHUB_SECRET: z.string().min(1),
});

const contactDeliveryEnvSchema = z.object({
  RESEND_API_KEY: z.string().min(1),
  CONTACT_FROM_EMAIL: z.string().email(),
  CONTACT_TO_EMAIL: z.string().email(),
});
const resendSenderEnvSchema = z.object({
  RESEND_API_KEY: z.string().min(1),
  CONTACT_FROM_EMAIL: z.string().email(),
});

export type AppEnv = z.infer<typeof appEnvSchema>;
export type AdminAuthEnv = z.infer<typeof adminAuthEnvSchema>;
export type ContactDeliveryEnv = z.infer<typeof contactDeliveryEnvSchema>;
export type ResendSenderEnv = z.infer<typeof resendSenderEnvSchema>;
export type EnvironmentValues = Readonly<Record<string, string | undefined>>;

export function parseAppEnv(env: EnvironmentValues = process.env): AppEnv {
  return appEnvSchema.parse(env);
}

export function isWaitlistEnvConfigured(
  env: EnvironmentValues = process.env
): boolean {
  const parsed = parseAppEnv(env);
  return Boolean(parsed.DATABASE_URL);
}

export function isAdminAuthEnvConfigured(
  env: EnvironmentValues = process.env
): boolean {
  const parsed = parseAppEnv(env);
  return adminAuthEnvSchema.safeParse(parsed).success;
}

export function getAdminAuthEnv(
  env: EnvironmentValues = process.env
): AdminAuthEnv {
  const parsed = parseAppEnv(env);
  return adminAuthEnvSchema.parse(parsed);
}

export function getContactDeliveryEnv(
  env: EnvironmentValues = process.env
): ContactDeliveryEnv | null {
  const parsed = parseAppEnv(env);
  const result = contactDeliveryEnvSchema.safeParse(parsed);
  return result.success ? result.data : null;
}

export function getResendSenderEnv(
  env: EnvironmentValues = process.env
): ResendSenderEnv | null {
  const parsed = parseAppEnv(env);
  const result = resendSenderEnvSchema.safeParse(parsed);
  return result.success ? result.data : null;
}

export function hasUpstashRedisEnv(
  env: EnvironmentValues = process.env
): boolean {
  const parsed = parseAppEnv(env);
  return Boolean(parsed.UPSTASH_REDIS_REST_URL && parsed.UPSTASH_REDIS_REST_TOKEN);
}

export function getAdminGithubIds(
  env: EnvironmentValues = process.env
): string[] {
  const parsed = parseAppEnv(env);
  if (!parsed.ADMIN_GITHUB_IDS) {
    return [];
  }

  return parsed.ADMIN_GITHUB_IDS.split(",")
    .map((value) => value.trim())
    .filter(Boolean);
}

