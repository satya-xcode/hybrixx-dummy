"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

/**
 * THEME PROVIDER
 * Wraps next-themes with this project's chosen defaults. This is the ONE
 * place theme behavior is configured — every page/component just reads
 * `.dark` CSS-variable tokens from globals.css, they never branch on theme
 * themselves.
 *
 * - attribute="class"   -> toggles the `.dark` class on <html>, which is
 *                          exactly what globals.css's `.dark { ... }` block
 *                          and the `@custom-variant dark` expect.
 * - defaultTheme="light" -> site opens in light mode for a first-time
 *                          visitor (per product decision), not OS preference.
 * - enableSystem={false} -> don't auto-switch based on OS theme; once a
 *                          visitor picks light/dark it sticks (persisted to
 *                          localStorage by next-themes) until they toggle it.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
