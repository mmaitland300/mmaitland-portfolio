"use client";

import { useState, useTransition } from "react";
import { AlertCircle, CheckCircle2, Send } from "lucide-react";
import { sendComposeEmail } from "@/actions/admin-email";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type FeedbackState = {
  success: boolean;
  message: string;
  warning?: string;
} | null;

export function AdminComposeForm() {
  const [toEmail, setToEmail] = useState("");
  const [toName, setToName] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [feedback, setFeedback] = useState<FeedbackState>(null);
  const [isPending, startTransition] = useTransition();

  function onSubmit() {
    setFeedback(null);
    setErrors({});

    startTransition(async () => {
      try {
        const result = await sendComposeEmail({
          toEmail,
          toName: toName.trim() || undefined,
          subject,
          body,
        });

        if (result.errors) {
          setErrors(result.errors);
        }

        setFeedback({
          success: result.success,
          message: result.message,
          warning: result.warning,
        });

        if (result.success) {
          setToEmail("");
          setToName("");
          setSubject("");
          setBody("");
        }
      } catch {
        setFeedback({
          success: false,
          message: "Could not send the email right now. Please try again.",
        });
      }
    });
  }

  return (
    <div className="space-y-4">
      {feedback ? (
        <div
          className={cn(
            "rounded-lg border p-3 text-sm",
            feedback.success
              ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
              : "border-destructive/40 bg-destructive/10 text-destructive"
          )}
        >
          <div className="flex items-center gap-2">
            {feedback.success ? (
              <CheckCircle2 size={16} className="shrink-0" />
            ) : (
              <AlertCircle size={16} className="shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
          {feedback.warning ? (
            <p className="mt-2 text-xs text-current/90">{feedback.warning}</p>
          ) : null}
        </div>
      ) : null}

      <div className="space-y-4 rounded-xl border border-border bg-card/40 p-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="compose-to-email">To email</Label>
            <Input
              id="compose-to-email"
              value={toEmail}
              onChange={(event) => setToEmail(event.target.value)}
              placeholder="someone@example.com"
              disabled={isPending}
            />
            {errors.toEmail?.[0] ? (
              <p className="text-xs text-destructive">{errors.toEmail[0]}</p>
            ) : null}
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="compose-to-name">Recipient name (optional)</Label>
            <Input
              id="compose-to-name"
              value={toName}
              onChange={(event) => setToName(event.target.value)}
              placeholder="Recipient name"
              disabled={isPending}
            />
            {errors.toName?.[0] ? (
              <p className="text-xs text-destructive">{errors.toName[0]}</p>
            ) : null}
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="compose-subject">Subject</Label>
            <Input
              id="compose-subject"
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              placeholder="Subject"
              disabled={isPending}
            />
            {errors.subject?.[0] ? (
              <p className="text-xs text-destructive">{errors.subject[0]}</p>
            ) : null}
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="compose-body">Message</Label>
            <Textarea
              id="compose-body"
              value={body}
              onChange={(event) => setBody(event.target.value)}
              rows={10}
              disabled={isPending}
            />
            {errors.body?.[0] ? (
              <p className="text-xs text-destructive">{errors.body[0]}</p>
            ) : null}
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="button" disabled={isPending} onClick={onSubmit}>
            <Send size={14} className="mr-1.5" />
            {isPending ? "Sending..." : "Send email"}
          </Button>
        </div>
      </div>
    </div>
  );
}
