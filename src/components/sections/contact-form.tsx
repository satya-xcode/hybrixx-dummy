"use client";

import * as React from "react";
import { useActionState } from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { Stack } from "@/components/layout/primitives";
import { Heading, Text } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { submitContact, type ContactFormState } from "@/app/actions/contact";

const inputClass =
  "h-11 w-full rounded-xl border border-border bg-surface px-4 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring";

const initialState: ContactFormState = { success: false };

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(
    submitContact,
    initialState
  );

  if (state.success) {
    return (
      <Stack gap="sm" align="center" className="py-12 text-center">
        <CheckCircle2 className="size-10 text-accent" />
        <Heading level="h3">Message sent</Heading>
        <Text variant="small" muted className="max-w-sm">
          Thanks for reaching out! We&apos;ll get back to you within a day.
          Your message has been saved to our system.
        </Text>
      </Stack>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {state.error && (
        <div className="flex items-center gap-2 rounded-lg bg-destructive/10 px-4 py-2 text-sm text-destructive">
          <AlertCircle className="size-4 shrink-0" />
          {state.error}
        </div>
      )}

      <Stack gap="xs">
        <label htmlFor="name" className="text-sm font-medium">
          Name
        </label>
        <input id="name" name="name" required className={inputClass} placeholder="Your name" />
      </Stack>

      <Stack gap="xs">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className={inputClass}
          placeholder="you@email.com"
        />
      </Stack>

      <Stack gap="xs">
        <label htmlFor="message" className="text-sm font-medium">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="w-full resize-none rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
          placeholder="How can we help?"
        />
      </Stack>

      <Button type="submit" size="lg" className="mt-2" disabled={isPending}>
        {isPending ? (
          <span className="flex items-center gap-2">
            <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            Sending...
          </span>
        ) : (
          "Send message"
        )}
      </Button>
    </form>
  );
}
