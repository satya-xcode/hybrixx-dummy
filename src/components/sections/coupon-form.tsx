"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Tag, X, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Flex } from "@/components/layout/primitives";
import { applyCouponAction, removeCouponAction } from "@/app/actions/cart";

interface CouponFormProps {
  appliedCouponCode?: string;
  appliedDiscountText?: string;
}

export function CouponForm({ appliedCouponCode, appliedDiscountText }: CouponFormProps) {
  const router = useRouter();
  const [code, setCode] = React.useState("");
  const [isPending, startTransition] = React.useTransition();
  const [error, setError] = React.useState<string | null>(null);

  function handleApply(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim()) return;

    setError(null);
    startTransition(async () => {
      const formData = new FormData();
      formData.append("couponCode", code);
      const res = await applyCouponAction(null, formData);

      if (res.success) {
        setCode("");
        router.refresh();
      } else {
        setError(res.error || "Failed to apply coupon.");
      }
    });
  }

  function handleRemove() {
    setError(null);
    startTransition(async () => {
      const res = await removeCouponAction();
      if (res.success) {
        router.refresh();
      } else {
        setError(res.error || "Failed to remove coupon.");
      }
    });
  }

  return (
    <div className="space-y-3 pt-4 border-t border-border/40">
      <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">
        Promo Code / Coupon
      </div>

      {appliedCouponCode ? (
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-3.5 flex items-center justify-between transition-all animate-in fade-in slide-in-from-bottom-2 duration-300">
          <Flex gap="sm" align="center">
            <Tag className="size-4 text-primary animate-pulse" />
            <div className="text-sm">
              <span className="font-bold text-primary">{appliedCouponCode}</span>
              <span className="text-muted-foreground ml-1.5 text-xs">({appliedDiscountText} Applied)</span>
            </div>
          </Flex>
          <Button
            variant="ghost"
            size="icon"
            className="size-8 rounded-full hover:bg-primary/10 text-primary"
            onClick={handleRemove}
            disabled={isPending}
            title="Remove Coupon"
          >
            <X className="size-4" />
          </Button>
        </div>
      ) : (
        <form onSubmit={handleApply} className="flex gap-2">
          <input
            type="text"
            placeholder="Enter code (e.g. OFF30)"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            disabled={isPending}
            className="h-10 flex-1 rounded-xl border border-border bg-surface px-3.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary/40 uppercase font-medium"
          />
          <Button
            type="submit"
            size="sm"
            disabled={isPending || !code.trim()}
            className="rounded-xl px-4"
          >
            {isPending ? "Applying..." : "Apply"}
          </Button>
        </form>
      )}

      {error && (
        <Flex gap="xs" align="center" className="text-xs text-destructive animate-in fade-in duration-200">
          <AlertCircle className="size-3.5 shrink-0" />
          <span>{error}</span>
        </Flex>
      )}
    </div>
  );
}
