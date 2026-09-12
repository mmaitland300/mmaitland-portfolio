"use client";

import { useActionState, useEffect, useId, useRef, useState } from "react";
import { Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { submitComment, type CommentActionResult } from "@/actions/comments";
import { signInWithGitHub } from "@/actions/auth";

interface CommentFormProps {
  projectSlug: string;
  currentPath: string;
  isSignedIn: boolean;
}

const initial: CommentActionResult = { success: false, message: "" };

export function CommentForm({
  projectSlug,
  currentPath,
  isSignedIn,
}: CommentFormProps) {
  const [body, setBody] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const feedbackRef = useRef<HTMLParagraphElement>(null);
  const fieldId = useId();
  const feedbackId = `${fieldId}-feedback`;
  const [state, formAction, isPending] = useActionState(
    async (previous: CommentActionResult, formData: FormData) => {
      const result = await submitComment(previous, formData);
      if (result.success) setBody("");
      return result;
    },
    initial
  );

  useEffect(() => {
    if (!state.message) return;
    if (!state.success && state.errors?.body) textareaRef.current?.focus();
    else feedbackRef.current?.focus();
  }, [state]);

  if (!isSignedIn) {
    return (
      <form
        action={async () => {
          await signInWithGitHub(currentPath);
        }}
      >
        <Button type="submit" variant="outline" size="sm">
          <Github className="mr-2 h-4 w-4" /> Sign in with GitHub to leave a
          question or comment
        </Button>
      </form>
    );
  }

  return (
    <form action={formAction} aria-busy={isPending} className="space-y-3">
      <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {isPending ? "Posting your comment." : state.success ? state.message : ""}
      </p>
      <input type="hidden" name="projectSlug" value={projectSlug} />
      <label htmlFor={fieldId} className="block text-sm font-medium">
        Your comment
      </label>
      <textarea
        ref={textareaRef}
        id={fieldId}
        name="body"
        value={body}
        onChange={(event) => setBody(event.target.value)}
        aria-invalid={!state.success && Boolean(state.errors?.body)}
        aria-describedby={!state.success && state.errors?.body ? feedbackId : undefined}
        readOnly={isPending}
        required
        minLength={3}
        maxLength={2000}
        rows={3}
        placeholder="Leave a question or comment..."
        className="w-full rounded-lg border border-border bg-card/40 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-violet/40 resize-y"
      />
      {state.success ? (
        <p ref={feedbackRef} tabIndex={-1} className="text-sm text-emerald-400">{state.message}</p>
      ) : state.message ? (
        <p ref={feedbackRef} id={feedbackId} tabIndex={-1} role="alert" className="text-sm text-destructive">
          {state.errors?.body?.[0] ?? state.message}
        </p>
      ) : null}
      <Button type="submit" size="sm" disabled={isPending}>
        {isPending ? "Posting..." : "Post comment"}
      </Button>
    </form>
  );
}
