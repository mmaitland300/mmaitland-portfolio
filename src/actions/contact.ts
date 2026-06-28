"use server";

import { Resend } from "resend";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { headers } from "next/headers";
import { contactSchema } from "./contact.contract";
import { getContactDeliveryEnv, hasUpstashRedisEnv, parseAppEnv } from "@/lib/env";
import {
  isPrismaConnectionUnavailable,
  logOptionalDatabaseUnavailableOnce,
} from "@/lib/optional-database";

export type ContactState =
  | { success: true; message: string }
  | {
      success: false;
      message: string;
      errors?: Record<string, string[]>;
    };

let ratelimit: Ratelimit | null = null;
/** Sliding-window limits only when `UPSTASH_REDIS_*` is set; otherwise contact relies on Zod + honeypot. */
function getRatelimit() {
  if (ratelimit) return ratelimit;
  if (hasUpstashRedisEnv()) {
    ratelimit = new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(3, "60 s"),
      analytics: true,
      prefix: "contact",
    });
    return ratelimit;
  }
  return null;
}

export async function submitContact(
  _prevState: ContactState,
  formData: FormData
): Promise<ContactState> {
  const raw = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    message: formData.get("message") as string,
    honeypot: (formData.get("_hp") as string) || "",
  };

  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    const errors: Record<string, string[]> = {};
    for (const [key, msgs] of Object.entries(fieldErrors)) {
      if (msgs) errors[key] = msgs;
    }
    return {
      success: false,
      message: "Please fix the errors below.",
      errors,
    };
  }

  const rl = getRatelimit();
  if (rl) {
    const headerStore = await headers();
    const ip =
      headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const { success: allowed } = await rl.limit(ip);
    if (!allowed) {
      return {
        success: false,
        message: "Too many requests. Please try again in a minute.",
      };
    }
  }

  const contactDeliveryEnv = getContactDeliveryEnv();
  if (!contactDeliveryEnv) {
    console.error("Missing Resend env vars");
    return {
      success: false,
      message: "Contact form is not configured yet. Please try again later.",
    };
  }

  try {
    const resend = new Resend(contactDeliveryEnv.RESEND_API_KEY);
    await resend.emails.send({
      from: contactDeliveryEnv.CONTACT_FROM_EMAIL,
      to: contactDeliveryEnv.CONTACT_TO_EMAIL,
      replyTo: parsed.data.email,
      subject: `Site contact: ${parsed.data.name}`,
      text: [
        `Name: ${parsed.data.name}`,
        `Email: ${parsed.data.email}`,
        ``,
        `Message:`,
        parsed.data.message,
      ].join("\n"),
    });
  } catch (err) {
    console.error("Failed to send email:", err);
    return {
      success: false,
      message: "Failed to send your message. Please try again later.",
    };
  }

  // Best-effort: email delivery is the success gate
  if (parseAppEnv().DATABASE_URL) {
    try {
      const { prisma } = await import("@/lib/prisma");
      await prisma.contactSubmission.create({
        data: {
          name: parsed.data.name,
          email: parsed.data.email,
          message: parsed.data.message,
        },
      });
    } catch (err) {
      if (isPrismaConnectionUnavailable(err)) {
        logOptionalDatabaseUnavailableOnce(
          "Admin inbox persistence",
          "email delivery succeeded, but this submission was not saved to the admin inbox.",
        );
      } else {
        console.error("Admin inbox persistence failed (best-effort):", err);
      }
    }
  }

  return {
    success: true,
    message: "Thanks for reaching out! I'll get back to you soon.",
  };
}
