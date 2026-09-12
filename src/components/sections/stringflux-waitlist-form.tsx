"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { CheckCircle2, AlertCircle, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { joinWaitlist, type WaitlistState } from "@/actions/stringflux-waitlist";

const initialState: WaitlistState = {
  success: false,
  message: "",
};

export function StringFluxWaitlistForm() {
  const [values, setValues] = useState({ email: "", interest: "" });
  const formRef = useRef<HTMLFormElement>(null);
  const feedbackRef = useRef<HTMLDivElement>(null);
  const [state, formAction, pending] = useActionState(joinWaitlist, initialState);

  useEffect(() => {
    if (!state.message) return;
    const invalidField = formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]');
    (invalidField ?? feedbackRef.current)?.focus();
  }, [state]);

  return (
    <>
      <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {pending ? "Joining the waitlist." : state.success ? state.message : ""}
      </p>
      {state.success ? (
        <div ref={feedbackRef} tabIndex={-1} aria-labelledby="wl-success-title" className="flex flex-col items-center justify-center py-10 text-center">
          <div className="p-3 rounded-full bg-green-500/10 mb-4">
            <CheckCircle2 className="h-8 w-8 text-green-500" />
          </div>
          <h3 id="wl-success-title" className="text-xl font-semibold mb-2">You&apos;re on the list.</h3>
          <p className="text-muted-foreground max-w-sm">{state.message}</p>
        </div>
      ) : (
        <form ref={formRef} action={formAction} aria-busy={pending} className="space-y-4">
          {state.message && !state.success && (
            <div ref={feedbackRef} tabIndex={-1} role="alert" className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
              <AlertCircle aria-hidden="true" className="h-4 w-4 shrink-0" />
              {state.message}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="wl-email">Email address</Label>
            <Input
              id="wl-email"
              name="email"
              value={values.email}
              onChange={(event) => setValues({ ...values, email: event.target.value })}
              autoComplete="email"
              aria-invalid={Boolean(state.errors?.email)}
              type="email"
              placeholder="you@example.com"
              required
              className="bg-card/50"
              aria-describedby={state.errors?.email ? "wl-consent wl-email-error" : "wl-consent"}
            />
            {state.errors?.email && (
              <p id="wl-email-error" className="text-xs text-destructive">{state.errors.email[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="wl-interest" className="flex items-center gap-1">
              What draws you to StringFlux?
              <span className="text-xs text-muted-foreground font-normal ml-1">(optional)</span>
            </Label>
            <Input
              id="wl-interest"
              name="interest"
              value={values.interest}
              onChange={(event) => setValues({ ...values, interest: event.target.value })}
              aria-invalid={Boolean(state.errors?.interest)}
              aria-describedby={state.errors?.interest ? "wl-interest-error" : undefined}
              type="text"
              placeholder="e.g. guitar texture layers, live performance, studio use..."
              maxLength={200}
              className="bg-card/50"
            />
            {state.errors?.interest && (
              <p id="wl-interest-error" className="text-xs text-destructive">{state.errors.interest[0]}</p>
            )}
          </div>

          {/* Honeypot */}
          <div className="absolute -left-[9999px]" aria-hidden="true">
            <input type="text" name="_hp" tabIndex={-1} autoComplete="off" />
          </div>

          <Button
            type="submit"
            variant="brandCta"
            disabled={pending}
            className="w-full sm:w-auto"
          >
            {pending ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Joining...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Mail className="h-4 w-4" /> Join the waitlist
              </span>
            )}
          </Button>

          <p id="wl-consent" className="text-xs text-muted-foreground leading-relaxed">
            Your email is used for this waitlist: a signup confirmation and one update when
            StringFlux is ready for beta or release. Reply to either email to request removal.
          </p>
        </form>
      )}
    </>
  );
}
