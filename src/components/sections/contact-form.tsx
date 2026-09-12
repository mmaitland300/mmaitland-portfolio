"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { submitContact, type ContactState } from "@/actions/contact";

const initialState: ContactState = {
  success: false,
  message: "",
};

export function ContactForm() {
  const [instanceKey, setInstanceKey] = useState(0);

  return (
    <ContactFormInstance
      key={instanceKey}
      onReset={() => setInstanceKey((key) => key + 1)}
    />
  );
}

interface ContactFormInstanceProps {
  onReset: () => void;
}

function ContactFormInstance({ onReset }: ContactFormInstanceProps) {
  const [values, setValues] = useState({ name: "", email: "", message: "" });
  const formRef = useRef<HTMLFormElement>(null);
  const feedbackRef = useRef<HTMLDivElement>(null);
  const [state, formAction, pending] = useActionState(
    submitContact,
    initialState
  );

  useEffect(() => {
    if (!state.message) return;
    const invalidField = formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]');
    (invalidField ?? feedbackRef.current)?.focus();
  }, [state]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {pending ? "Sending your message." : state.success ? `Message sent. ${state.message}` : ""}
      </p>
      {state.success ? (
        <div ref={feedbackRef} tabIndex={-1} aria-labelledby="contact-success-title" className="flex flex-col items-center justify-center py-12 text-center">
          <div className="p-3 rounded-full bg-success/10 mb-4">
            <CheckCircle2 className="h-8 w-8 text-success" />
          </div>
          <h3 id="contact-success-title" className="text-xl font-semibold mb-2">Message Sent!</h3>
          <p className="text-muted-foreground mb-6">{state.message}</p>
          <Button
            variant="outline"
            onClick={onReset}
          >
            Send Another Message
          </Button>
        </div>
      ) : (
        <form
          ref={formRef}
          action={formAction}
          aria-busy={pending}
          className="space-y-6"
        >
          {state.message && !state.success && (
            <div ref={feedbackRef} tabIndex={-1} role="alert" className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
              <AlertCircle aria-hidden="true" className="h-4 w-4 shrink-0" />
              {state.message}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={values.name}
                onChange={(event) => setValues({ ...values, name: event.target.value })}
                autoComplete="name"
                aria-invalid={Boolean(state.errors?.name)}
                aria-describedby={state.errors?.name ? "contact-name-error" : undefined}
                placeholder="Your name"
                required
                className="bg-card/50"
              />
              {state.errors?.name && (
                <p id="contact-name-error" className="text-xs text-destructive">{state.errors.name[0]}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                value={values.email}
                onChange={(event) => setValues({ ...values, email: event.target.value })}
                autoComplete="email"
                aria-invalid={Boolean(state.errors?.email)}
                aria-describedby={state.errors?.email ? "contact-email-error" : undefined}
                type="email"
                placeholder="you@example.com"
                required
                className="bg-card/50"
              />
              {state.errors?.email && (
                <p id="contact-email-error" className="text-xs text-destructive">
                  {state.errors.email[0]}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              name="message"
              value={values.message}
              onChange={(event) => setValues({ ...values, message: event.target.value })}
              aria-invalid={Boolean(state.errors?.message)}
              aria-describedby={state.errors?.message ? "contact-message-error" : undefined}
              placeholder="Tell me about your project, idea, or just say hi..."
              rows={6}
              required
              className="bg-card/50 resize-none"
            />
            {state.errors?.message && (
              <p id="contact-message-error" className="text-xs text-destructive">
                {state.errors.message[0]}
              </p>
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
                Sending...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Send className="h-4 w-4" /> Send Message
              </span>
            )}
          </Button>
        </form>
      )}
    </motion.div>
  );
}
