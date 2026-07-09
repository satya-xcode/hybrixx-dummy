import * as React from "react";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/typography";
import { Flex } from "@/components/layout/primitives";

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ComponentType<{ className?: string }>;
  description?: string;
}

export function StatCard({
  label,
  value,
  icon: Icon,
  description,
}: StatCardProps) {
  return (
    <Card className="flex flex-col gap-2 p-6">
      <Flex justify="between" align="center" gap="sm" className="w-full">
        <Text variant="small" muted className="font-semibold">
          {label}
        </Text>
        {Icon && <Icon className="size-5 text-primary/80" />}
      </Flex>
      <div className="space-y-1">
        <h3 className="text-3xl font-bold tracking-tight text-foreground">
          {value}
        </h3>
        {description && (
          <Text variant="xs" muted>
            {description}
          </Text>
        )}
      </div>
    </Card>
  );
}
