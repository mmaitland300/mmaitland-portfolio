"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { EyeOff, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { hideComment, unhideComment, type CommentActionResult } from "@/actions/comments";
import { cn } from "@/lib/utils";

export interface CommentData {
  id: string;
  body: string;
  hidden: boolean;
  createdAt: Date;
  user: {
    name: string | null;
    image: string | null;
  };
}

interface CommentListProps {
  comments: CommentData[];
  isAdmin: boolean;
  /** When false, empty state does not invite the reader to post (e.g. auth not configured). */
  inviteToPost?: boolean;
}

export function CommentList({
  comments,
  isAdmin,
  inviteToPost = true,
}: CommentListProps) {
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<CommentActionResult | null>(null);
  const router = useRouter();

  function runAction(action: () => Promise<CommentActionResult>) {
    setFeedback(null);
    startTransition(async () => {
      try {
        const result = await action();
        setFeedback(result);
        if (result.success) router.refresh();
      } catch {
        setFeedback({ success: false, message: "Could not update this comment. Please try again." });
      }
    });
  }

  if (comments.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        {inviteToPost
          ? "No questions or comments yet. Sign in with GitHub to leave the first one."
          : "No questions or comments yet. This section is read-only until sign-in is enabled."}
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {feedback && (
        <p role={feedback.success ? "status" : "alert"} className="text-sm text-muted-foreground">
          {feedback.message}
        </p>
      )}
      {comments.map((comment) => (
        <div
          key={comment.id}
          className={cn(
            "rounded-lg border border-border bg-card/30 px-4 py-3",
            comment.hidden && "opacity-50"
          )}
        >
          <div className="flex items-center gap-2 mb-2">
            {comment.user.image && (
              <Image
                src={comment.user.image}
                alt=""
                width={24}
                height={24}
                className="rounded-full"
              />
            )}
            <span className="text-sm font-medium text-foreground">
              {comment.user.name ?? "Anonymous"}
            </span>
            <span className="text-xs text-muted-foreground">
              {new Date(comment.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            {comment.hidden && (
              <span className="text-xs text-muted-foreground">(hidden)</span>
            )}
          </div>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
            {comment.body}
          </p>
          {isAdmin && (
            <div className="mt-2">
              {comment.hidden ? (
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={isPending}
                  onClick={() =>
                    runAction(() => unhideComment(comment.id))
                  }
                >
                  <Eye size={14} className="mr-1.5" /> Restore
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={isPending}
                  onClick={() =>
                    runAction(() => hideComment(comment.id))
                  }
                >
                  <EyeOff size={14} className="mr-1.5" /> Hide
                </Button>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
