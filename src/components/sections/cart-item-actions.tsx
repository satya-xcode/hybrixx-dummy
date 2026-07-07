"use client";

import * as React from "react";
import { Flex } from "@/components/layout/primitives";
import { Text } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { updateCartQuantity, removeFromCart } from "@/app/actions/cart";
import { Plus, Minus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function CartItemActions({
  itemId,
  quantity,
}: {
  itemId: number;
  quantity: number;
}) {
  const [isPending, startTransition] = React.useTransition();
  const router = useRouter();

  function handleQuantityChange(newQty: number) {
    startTransition(async () => {
      await updateCartQuantity(itemId, newQty);
      router.refresh();
    });
  }

  function handleRemove() {
    startTransition(async () => {
      await removeFromCart(itemId);
      router.refresh();
    });
  }

  return (
    <Flex gap="xs" align="center" className="shrink-0">
      <Button
        variant="outline"
        size="sm"
        className="size-8 p-0"
        onClick={() => handleQuantityChange(quantity - 1)}
        disabled={isPending || quantity <= 1}
      >
        <Minus className="size-3" />
      </Button>

      <Text variant="small" className="w-6 text-center font-medium">
        {quantity}
      </Text>

      <Button
        variant="outline"
        size="sm"
        className="size-8 p-0"
        onClick={() => handleQuantityChange(quantity + 1)}
        disabled={isPending}
      >
        <Plus className="size-3" />
      </Button>

      <Button
        variant="outline"
        size="sm"
        className="ml-2 size-8 p-0 text-destructive hover:bg-destructive/10"
        onClick={handleRemove}
        disabled={isPending}
      >
        <Trash2 className="size-3" />
      </Button>
    </Flex>
  );
}
