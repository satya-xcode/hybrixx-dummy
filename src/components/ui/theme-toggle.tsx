"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * THEME TOGGLE — flips the `.dark` class via next-themes.
 *
 * `mounted` guard avoids a hydration mismatch: the server always renders
 * the light-mode icon (since defaultTheme="light"), but a returning visitor
 * might have "dark" in localStorage. We render a neutral placeholder until
 * after mount, then swap to the real icon for the resolved theme.
 */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    // Standard next-themes mount guard: resolvedTheme is only known once
    // we're on the client (it reads localStorage), so the first render must
    // match the server's guess. This is the same client-only-state pattern
    // Next's own hydration guide endorses via useEffect + suppressHydrationWarning.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <Button
      variant="outline"
      size="icon"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      suppressHydrationWarning
    >
      {mounted ? isDark ? <Sun /> : <Moon /> : <span className="size-4" />}
    </Button>
  );
}
