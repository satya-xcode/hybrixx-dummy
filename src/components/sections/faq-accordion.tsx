"use client";

import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import type { FAQ } from "@/lib/types";

const easeLiquid = [0.16, 1, 0.3, 1] as const;

export function FaqAccordion({ items }: { items: FAQ[] }) {
  const [openId, setOpenId] = React.useState<number | null>(
    items[0]?.id ?? null
  );

  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <Card key={item.id} className="gap-0 overflow-hidden p-0">
            <button
              type="button"
              onClick={() => setOpenId(isOpen ? null : item.id)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
            >
              <Text className="font-medium">{item.question}</Text>
              <ChevronDown
                className={cn(
                  "size-4 shrink-0 text-muted-foreground transition-transform duration-300",
                  isOpen && "rotate-180"
                )}
              />
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: easeLiquid }}
                  className="overflow-hidden"
                >
                  <Text variant="small" muted className="px-6 pb-5">
                    {item.answer}
                  </Text>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        );
      })}
    </div>
  );
}
