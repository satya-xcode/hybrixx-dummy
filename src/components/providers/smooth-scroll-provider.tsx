"use client";

import { ReactLenis } from "lenis/react";
import type { ReactNode } from "react";

/**
 * SMOOTH SCROLL PROVIDER
 * root=true → Lenis hijacks the native document scroll instead of wrapping
 * children in an extra scroll container. This is the mode that plays nicely
 * with CSS `position: sticky` navbars and `IntersectionObserver`-based
 * reveal animations (Motion's `whileInView`).
 *
 * Tune feel (lerp/duration/wheelMultiplier) in ONE place — here.
 */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1,
        duration: 1.2,
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.2,
      }}
    >
      {children}
    </ReactLenis>
  );
}
