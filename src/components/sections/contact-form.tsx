"use client";

import * as React from "react";
import { CheckCircle2 } from "lucide-react";
import { Stack } from "@/components/layout/primitives";
import { Heading, Text } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";

const inputClass =
  "h-11 w-full rounded-xl border border-border bg-surface px-4 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring";

/**
 * NOTE: this is a static export (`output: "export"` in next.config.ts), so
 * there's no server action / API route to actually send this anywhere.
 * Submit just flips local state to a success message — wire this up to a
 * form backend (Formspree, Resend, etc.) or an API route for a real deploy.
 */
export function ContactForm() {
  const [submitted, setSubmitted] = React.useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <Stack gap="sm" align="center" className="py-12 text-center">
        <CheckCircle2 className="size-10 text-accent" />
        <Heading level="h3">Message sent</Heading>
        <Text variant="small" muted className="max-w-sm">
          This is a demo form (static export, no backend) — in a real build
          this would land in your inbox. We&apos;d normally reply within a day.
        </Text>
      </Stack>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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

      <Button type="submit" size="lg" className="mt-2">
        Send message
      </Button>
    </form>
  );
}
