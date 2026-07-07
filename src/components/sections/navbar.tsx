import { Suspense } from "react";
import { NavbarClient } from "./navbar-client";
import { CartBadge } from "./cart-badge";

/**
 * Navbar wrapper — Server Component.
 * Renders the client-side NavbarClient and streams the CartBadge
 * via Suspense (it reads cookies, which is request-time data).
 */
export function Navbar() {
  return (
    <NavbarClient
      cartBadge={
        <Suspense fallback={null}>
          <CartBadge />
        </Suspense>
      }
    />
  );
}
