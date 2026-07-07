"use client";

import * as React from "react";
import { useActionState } from "react";
import { Flex } from "@/components/layout/primitives";
import { Text } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { subscribe, type NewsletterState } from "@/app/actions/newsletter";
import { CheckCircle2 } from "lucide-react";

const initialState: NewsletterState = { success: false };

export function NewsletterForm() {
  const [state, formAction, isPending] = useActionState(
    subscribe,
    initialState
  );

  if (state.success) {
    return (
      <Flex gap="sm" className="mt-4" align="center">
        <CheckCircle2 className="size-5 text-green-400" />
        <Text className="text-sm">{state.message}</Text>
      </Flex>
    );
  }

  return (
    <form action={formAction}>
      <Flex gap="sm" className="mt-4 w-full max-w-sm" wrap>
        <input
          type="email"
          name="email"
          placeholder="you@email.com"
          required
          className="h-11 flex-1 rounded-xl border border-secondary-foreground/20 bg-secondary-foreground/10 px-4 text-sm text-secondary-foreground outline-none placeholder:text-secondary-foreground/50 focus-visible:ring-2 focus-visible:ring-primary"
        />
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : (
            "Subscribe"
          )}
        </Button>
      </Flex>
      {state.error && (
        <Text className="mt-2 text-xs text-red-400">{state.error}</Text>
      )}
    </form>
  );
}
