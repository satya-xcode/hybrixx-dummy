import { cookies } from "next/headers";
import { getCartCount } from "@/lib/data/cart";

/**
 * Server Component that streams the cart item count.
 * Wrapped in <Suspense> in the navbar so the rest of the nav prerenders.
 */
export async function CartBadge() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("cart_session")?.value;

  if (!sessionId) return null;

  const count = await getCartCount(sessionId);

  if (count === 0) return null;

  return (
    <span className="absolute -right-1.5 -top-1.5 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
      {count > 9 ? "9+" : count}
    </span>
  );
}
