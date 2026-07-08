"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { addToCart } from "@/app/actions/cart";
import { useCartUI } from "@/lib/stores/cart-store";
import { Check } from "lucide-react";

export function AddToCartButton({ productId, size = "sm" }: { productId: number; size?: "sm" | "lg" }) {
  const [isPending, startTransition] = React.useTransition();
  const [added, setAdded] = React.useState(false);
  const openCart = useCartUI((s) => s.openCart);
  const router = useRouter();

  function handleClick() {
    startTransition(async () => {
      await addToCart(productId);
      // Refetch the server component tree so CartBadge picks up the new count
      router.refresh();
      setAdded(true);
      openCart();
      setTimeout(() => setAdded(false), 2000);
    });
  }

  return (
    <Button
      size={size}
      onClick={handleClick}
      disabled={isPending}
      className="min-w-[60px]"
    >
      {isPending ? (
        <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : added ? (
        <>
          <Check className="size-4" />
          Added
        </>
      ) : (
        "Add"
      )}
    </Button>
  );
}

