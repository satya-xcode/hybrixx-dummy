import { Zap, Cable, BatteryCharging, Package } from "lucide-react";
import type { ProductCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

const categoryConfig: Record<
  ProductCategory,
  { icon: typeof Zap; gradient: string }
> = {
  charger: {
    icon: Zap,
    gradient: "from-primary/25 via-primary/5 to-transparent",
  },
  cable: {
    icon: Cable,
    gradient: "from-accent/25 via-accent/5 to-transparent",
  },
  "power-bank": {
    icon: BatteryCharging,
    gradient: "from-warning/25 via-warning/5 to-transparent",
  },
  kit: {
    icon: Package,
    gradient: "from-secondary/20 via-secondary/5 to-transparent",
  },
};

/**
 * PRODUCT VISUAL — placeholder art standing in for real product photography.
 * Swap the inner content for a <next/image> when real assets exist; keep
 * the `aspect-square` wrapper and rounded-xl radius so layout doesn't shift.
 */
export function ProductVisual({
  category,
  className,
}: {
  category: ProductCategory;
  className?: string;
}) {
  const { icon: Icon, gradient } = categoryConfig[category];

  return (
    <div
      className={cn(
        "relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br",
        gradient,
        className
      )}
    >
      <div className="glass-2 flex size-16 items-center justify-center rounded-full sm:size-20">
        <Icon className="size-7 text-foreground/70 sm:size-8" strokeWidth={1.5} />
      </div>
    </div>
  );
}
