"use server";

import { revalidatePath } from "next/cache";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { isAdmin } from "@/lib/admin";
import { hasUpstashRedisEnv, parseAppEnv } from "@/lib/env";
import { commentSchema } from "./comments.contract";
import { getCommentableSlugs } from "@/content/projects";

export type CommentActionResult =
  | { success: true; message: string }
  | { success: false; message: string; errors?: Record<string, string[]> };

let ratelimit: Ratelimit | null = null;
function getCommentRatelimit() {
  if (ratelimit) return ratelimit;
  if (hasUpstashRedisEnv()) {
    ratelimit = new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(5, "60 s"),
      analytics: true,
      prefix: "comment",
    });
    return ratelimit;
  }
  return null;
}

async function requireAuth(): Promise<string | CommentActionResult> {
  if (!parseAppEnv().DATABASE_URL) {
    return { success: false, message: "Comments are not available." };
  }

  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: "You must be signed in to comment." };
  }

  return session.user.id;
}

export async function submitComment(
  _prevState: CommentActionResult,
  formData: FormData
): Promise<CommentActionResult> {
  const userId = await requireAuth();
  if (typeof userId !== "string") return userId;

  const raw = {
    projectSlug: formData.get("projectSlug") as string,
    body: formData.get("body") as string,
  };

  const parsed = commentSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    const errors: Record<string, string[]> = {};
    for (const [key, msgs] of Object.entries(fieldErrors)) {
      if (msgs) errors[key] = msgs;
    }
    return { success: false, message: "Please fix the errors below.", errors };
  }

  if (!getCommentableSlugs().has(parsed.data.projectSlug)) {
    return { success: false, message: "Comments are not enabled for this project." };
  }

  try {
    const rl = getCommentRatelimit();
    if (rl) {
      const result = await rl.limit(userId);
      if (result.reason === "timeout") throw new Error("Comment rate limit timed out.");
      if (!result.success) {
        return {
          success: false,
          message: "Too many comments. Please wait a minute.",
        };
      }
    }
  } catch (error) {
    console.error("Comment rate limit unavailable:", error);
    return {
      success: false,
      message: "Comments are temporarily unavailable. Please try again in a minute.",
    };
  }

  try {
    await prisma.projectComment.create({
      data: {
        projectSlug: parsed.data.projectSlug,
        userId,
        body: parsed.data.body,
      },
    });

  } catch (error) {
    console.error("Failed to save comment:", error);
    return {
      success: false,
      message: "Could not save your comment. Please try again.",
    };
  }

  try {
    revalidatePath(`/projects/${parsed.data.projectSlug}`);
  } catch (error) {
    console.error("Comment saved but page refresh failed:", error);
    return { success: true, message: "Comment posted. Refresh the page to see it." };
  }
  return { success: true, message: "Comment posted." };
}

export async function hideComment(
  commentId: string
): Promise<CommentActionResult> {
  const authorized = await isAdmin();
  if (!authorized) {
    return { success: false, message: "Unauthorized." };
  }

  try {
    const comment = await prisma.projectComment.update({
      where: { id: commentId },
      data: { hidden: true },
      select: { projectSlug: true },
    });

    revalidatePath(`/projects/${comment.projectSlug}`);
    return { success: true, message: "Comment hidden." };
  } catch (error) {
    console.error("Failed to hide comment:", error);
    return { success: false, message: "Could not hide this comment." };
  }
}

export async function unhideComment(
  commentId: string
): Promise<CommentActionResult> {
  const authorized = await isAdmin();
  if (!authorized) {
    return { success: false, message: "Unauthorized." };
  }

  try {
    const comment = await prisma.projectComment.update({
      where: { id: commentId },
      data: { hidden: false },
      select: { projectSlug: true },
    });

    revalidatePath(`/projects/${comment.projectSlug}`);
    return { success: true, message: "Comment restored." };
  } catch (error) {
    console.error("Failed to unhide comment:", error);
    return { success: false, message: "Could not restore this comment." };
  }
}
