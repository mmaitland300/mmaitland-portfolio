"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Mail,
  MailOpen,
  Archive,
  ArchiveRestore,
  AlertCircle,
  CheckCircle2,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  markAsRead,
  markAsUnread,
  archiveSubmission,
  unarchiveSubmission,
} from "@/actions/inbox";
import { replyToSubmission } from "@/actions/admin-email";
import { cn } from "@/lib/utils";
import { normalizeReplySubject } from "@/lib/email-subject";

interface Submission {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  archivedAt: Date | null;
  createdAt: Date;
}

interface SentEmailHistoryItem {
  id: string;
  subject: string;
  body: string;
  createdAt: Date;
  sentByName: string | null;
}

interface InboxListProps {
  submissions: Submission[];
  sentEmailsBySubmissionId: Record<string, SentEmailHistoryItem[]>;
  mode?: "active" | "archived";
}

type FeedbackState = {
  success: boolean;
  message: string;
  warning?: string;
  /** Set only after a successful reply send; drives compact status badges */
  replyDelivery?: {
    historySaved: boolean;
    markedRead: boolean;
  };
} | null;

function ReplyStatusBadges({
  historySaved,
  markedRead,
}: {
  historySaved: boolean;
  markedRead: boolean;
}) {
  const ok =
    "border-emerald-500/35 bg-emerald-500/15 text-emerald-200/95";
  const warn =
    "border-amber-500/40 bg-amber-500/10 text-amber-200/95";

  return (
    <div className="mt-2 flex flex-wrap items-center gap-1.5">
      <span
        className={cn(
          "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium tabular-nums",
          ok
        )}
      >
        Accepted for sending
      </span>
      <span
        className={cn(
          "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium tabular-nums",
          historySaved ? ok : warn
        )}
      >
        History {historySaved ? "saved" : "not saved"}
      </span>
      <span
        className={cn(
          "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium tabular-nums",
          markedRead ? ok : warn
        )}
      >
        Marked read {markedRead ? "yes" : "no"}
      </span>
    </div>
  );
}

export function InboxList({
  submissions,
  sentEmailsBySubmissionId,
  mode = "active",
}: InboxListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replySubject, setReplySubject] = useState("");
  const [replyBody, setReplyBody] = useState("");
  const [replyErrors, setReplyErrors] = useState<Record<string, string[]>>({});
  const [feedback, setFeedback] = useState<FeedbackState>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function runInboxAction(
    id: string,
    action: (submissionId: string) => Promise<{ success: boolean; message: string }>
  ) {
    setPendingId(id);
    setFeedback(null);

    startTransition(async () => {
      try {
        const result = await action(id);
        setFeedback({
          success: result.success,
          message: result.message,
        });

        if (result.success) {
          if (replyingToId === id) {
            setReplyingToId(null);
            setReplySubject("");
            setReplyBody("");
            setReplyErrors({});
          }
          router.refresh();
        }
      } catch {
        setFeedback({
          success: false,
          message:
            "Could not update this message right now. Please try again in a moment.",
        });
      } finally {
        setPendingId(null);
      }
    });
  }

  function startReply(submission: Submission) {
    if (replyingToId === submission.id) {
      setReplyingToId(null);
      setReplySubject("");
      setReplyBody("");
      setReplyErrors({});
      return;
    }

    setReplyingToId(submission.id);
    setReplySubject(normalizeReplySubject(`Site contact: ${submission.name}`));
    setReplyBody("");
    setReplyErrors({});
    setFeedback(null);
  }

  function sendReply(submissionId: string) {
    setPendingId(submissionId);
    setFeedback(null);
    setReplyErrors({});

    startTransition(async () => {
      try {
        const result = await replyToSubmission({
          submissionId,
          subject: replySubject,
          body: replyBody,
        });

        if (result.errors) {
          setReplyErrors(result.errors);
        }

        setFeedback({
          success: result.success,
          message: result.message,
          warning: result.warning,
          replyDelivery:
            result.success
              ? {
                  historySaved: result.historySaved,
                  markedRead: result.markedRead,
                }
              : undefined,
        });

        if (result.success) {
          setReplyingToId(null);
          setReplySubject("");
          setReplyBody("");
          setReplyErrors({});
          router.refresh();
        }
      } catch {
        setFeedback({
          success: false,
          message: "Could not send the reply right now. Please try again.",
        });
      } finally {
        setPendingId(null);
      }
    });
  }

  return (
    <div className="space-y-3">
      {feedback && (
        <div
          className={cn(
            "rounded-lg border p-3 text-sm",
            feedback.success
              ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
              : "border-destructive/40 bg-destructive/10 text-destructive"
          )}
          role="status"
          aria-live="polite"
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
          {feedback.success && feedback.replyDelivery ? (
            <ReplyStatusBadges
              historySaved={feedback.replyDelivery.historySaved}
              markedRead={feedback.replyDelivery.markedRead}
            />
          ) : null}
        </div>
      )}

      {submissions.map((sub) => {
        const isExpanded = expandedId === sub.id;
        const isReplying = replyingToId === sub.id;
        const history = sentEmailsBySubmissionId[sub.id] ?? [];
        const isSubmissionPending = isPending && pendingId === sub.id;

        return (
          <div
            key={sub.id}
            className={cn(
              "overflow-hidden rounded-xl border border-border transition-colors",
              !sub.read ? "border-brand-violet/20 bg-card/80" : "bg-card/30"
            )}
          >
            <button
              onClick={() => setExpandedId(isExpanded ? null : sub.id)}
              className="flex w-full items-start gap-3 p-4 text-left"
            >
              <div className="mt-0.5 shrink-0">
                {sub.read ? (
                  <MailOpen size={16} className="text-muted-foreground" />
                ) : (
                  <Mail size={16} className="text-brand-violet" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={cn(
                      "truncate text-sm font-medium",
                      !sub.read && "text-foreground"
                    )}
                  >
                    {sub.name}
                  </span>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {new Date(sub.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{sub.email}</p>
                <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
                  {sub.message}
                </p>
              </div>
            </button>

            {isExpanded ? (
              <div className="border-t border-border px-4 pt-3 pb-4">
                <p className="mb-4 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                  {sub.message}
                </p>

                {history.length > 0 ? (
                  <div className="mb-4 rounded-lg border border-border/80 bg-card/40 p-3">
                    <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Previous replies ({history.length})
                    </p>
                    <div className="space-y-2">
                      {history.map((item) => (
                        <div key={item.id} className="rounded-md border border-border/60 p-2">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <p className="text-xs font-medium text-foreground">{item.subject}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(item.createdAt).toLocaleString("en-US", {
                                month: "short",
                                day: "numeric",
                                hour: "numeric",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                          <p className="mt-1 whitespace-pre-wrap text-xs text-muted-foreground">
                            {item.body}
                          </p>
                          {item.sentByName ? (
                            <p className="mt-1 text-[11px] text-muted-foreground/80">
                              Sent by {item.sentByName}
                            </p>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}

                {isReplying ? (
                  <div className="mb-4 space-y-3 rounded-lg border border-border/80 bg-card/40 p-3">
                    <div className="space-y-1">
                      <Label htmlFor={`reply-to-${sub.id}`}>To</Label>
                      <Input id={`reply-to-${sub.id}`} value={sub.email} disabled />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor={`reply-subject-${sub.id}`}>Subject</Label>
                      <Input
                        id={`reply-subject-${sub.id}`}
                        value={replySubject}
                        onChange={(event) => setReplySubject(event.target.value)}
                        disabled={isPending}
                      />
                      {replyErrors.subject?.[0] ? (
                        <p className="text-xs text-destructive">{replyErrors.subject[0]}</p>
                      ) : null}
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor={`reply-body-${sub.id}`}>Message</Label>
                      <Textarea
                        id={`reply-body-${sub.id}`}
                        value={replyBody}
                        onChange={(event) => setReplyBody(event.target.value)}
                        rows={6}
                        disabled={isPending}
                      />
                      {replyErrors.body?.[0] ? (
                        <p className="text-xs text-destructive">{replyErrors.body[0]}</p>
                      ) : null}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        disabled={isPending}
                        onClick={() => sendReply(sub.id)}
                      >
                        <Send size={14} className="mr-1.5" />
                        {isSubmissionPending ? "Sending..." : "Send reply"}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={isPending}
                        onClick={() => {
                          setReplyingToId(null);
                          setReplySubject("");
                          setReplyBody("");
                          setReplyErrors({});
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : null}

                <div className="flex items-center gap-2">
                  {sub.read ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={isPending}
                      onClick={() => runInboxAction(sub.id, markAsUnread)}
                    >
                      <Mail size={14} className="mr-1.5" /> Mark unread
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={isPending}
                      onClick={() => runInboxAction(sub.id, markAsRead)}
                    >
                      <MailOpen size={14} className="mr-1.5" /> Mark read
                    </Button>
                  )}
                  {mode === "archived" ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={isPending}
                      onClick={() => runInboxAction(sub.id, unarchiveSubmission)}
                    >
                      <ArchiveRestore size={14} className="mr-1.5" /> Restore
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={isPending}
                      onClick={() => runInboxAction(sub.id, archiveSubmission)}
                    >
                      <Archive size={14} className="mr-1.5" /> Archive
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={isPending}
                    onClick={() => startReply(sub)}
                    className="ml-auto"
                  >
                    <Send size={14} className="mr-1.5" />
                    {isReplying ? "Close reply" : "Reply"}
                  </Button>
                </div>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
