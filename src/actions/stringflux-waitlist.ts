"use server";

import { Resend } from "resend";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { headers } from "next/headers";
import { isWaitlistConfigured } from "@/lib/feature-config";
import { getContactDeliveryEnv, hasUpstashRedisEnv } from "@/lib/env";
import { requireAcceptedEmail } from "@/lib/email-delivery";
import {
  normalizeWaitlistEmail,
  waitlistSchema,
} from "./stringflux-waitlist.contract";

export type WaitlistState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

let ratelimit: Ratelimit | null = null;
/** Sliding-window limits only when `UPSTASH_REDIS_*` is set; otherwise waitlist relies on Zod + honeypot. */
function getRatelimit() {
  if (ratelimit) return ratelimit;
  if (hasUpstashRedisEnv()) {
    ratelimit = new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(3, "60 s"),
      analytics: true,
      prefix: "waitlist",
    });
    return ratelimit;
  }
  return null;
}

export async function joinWaitlist(
  _prevState: WaitlistState,
  formData: FormData
): Promise<WaitlistState> {
  const raw = {
    email: formData.get("email") as string,
    interest: (formData.get("interest") as string) || undefined,
    honeypot: (formData.get("_hp") as string) || "",
  };

  const parsed = waitlistSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    const errors: Record<string, string[]> = {};
    for (const [key, msgs] of Object.entries(fieldErrors)) {
      if (msgs) errors[key] = msgs;
    }
    return { success: false, message: "Please fix the errors below.", errors };
  }

  const normalizedEmail = normalizeWaitlistEmail(parsed.data.email);

  if (!isWaitlistConfigured()) {
    return {
      success: false,
      message: "Waitlist is not configured yet. Please check back soon.",
    };
  }

  try {
    const rl = getRatelimit();
    if (rl) {
      const headerStore = await headers();
      const ip =
        headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
      const result = await rl.limit(ip);
      if (result.reason === "timeout") throw new Error("Waitlist rate limit timed out.");
      if (!result.success) {
        return {
          success: false,
          message: "Too many requests. Please try again in a minute.",
        };
      }
    }
  } catch (error) {
    console.error("Waitlist rate limit unavailable:", error);
    return {
      success: false,
      message: "The waitlist is temporarily unavailable. Please try again in a minute.",
    };
  }

  const successResult: WaitlistState = {
    success: true,
    message: "You're on the list. I'll reach out when it's ready.",
  };

  // Atomic conflict handling: only the request that inserts the row sends notices.
  try {
    const { prisma } = await import("@/lib/prisma");
    const { count } = await prisma.stringFluxWaitlist.createMany({
      skipDuplicates: true,
      data: {
        email: normalizedEmail,
        source: "stringflux-page",
        interest: parsed.data.interest ?? null,
      },
    });
    if (count === 0) return successResult;
  } catch (err) {
    console.error("StringFlux waitlist persistence failed:", err);
    return {
      success: false,
      message: "Failed to join the waitlist. Please try again later.",
    };
  }

  // Notifications are best-effort after persistence. Require a reply address for removal requests.
  const deliveryEnv = getContactDeliveryEnv();
  if (deliveryEnv) {
    const resend = new Resend(deliveryEnv.RESEND_API_KEY);

    try {
      const sendResult = await resend.emails.send({
        from: deliveryEnv.CONTACT_FROM_EMAIL,
        to: deliveryEnv.CONTACT_TO_EMAIL,
        replyTo: normalizedEmail,
        subject: `StringFlux Waitlist Signup: ${normalizedEmail}`,
        text: [
          `A new StringFlux waitlist signup was received.`,
          ``,
          `Email: ${normalizedEmail}`,
          `Interest: ${parsed.data.interest ?? "(not provided)"}`,
          `Source: stringflux-page`,
        ].join("\n"),
      });
      requireAcceptedEmail(sendResult);
    } catch (err) {
      console.error(
        "StringFlux waitlist owner notification failed (best-effort):",
        err
      );
    }

    try {
      const sendResult = await resend.emails.send({
        from: deliveryEnv.CONTACT_FROM_EMAIL,
        to: normalizedEmail,
        replyTo: deliveryEnv.CONTACT_TO_EMAIL,
        subject: "You're on the StringFlux waitlist",
        text: [
          `Hey,`,
          ``,
          `You're on the StringFlux waitlist. I'll reach out when beta access or a release is ready.`,
          ``,
          `You can unsubscribe at any time by replying to this email.`,
          ``,
          `- Matt`,
        ].join("\n"),
      });
      requireAcceptedEmail(sendResult);
    } catch (err) {
      console.error(
        "StringFlux waitlist confirmation email failed (best-effort):",
        err
      );
    }
  } else {
    console.warn("StringFlux waitlist notifications are disabled until Resend and CONTACT_TO_EMAIL are configured.");
  }

  return successResult;
}
