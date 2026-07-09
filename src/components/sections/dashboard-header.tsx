import * as React from "react";
import { Heading, Text } from "@/components/ui/typography";
import { Flex } from "@/components/layout/primitives";

interface DashboardHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function DashboardHeader({
  title,
  description,
  action,
}: DashboardHeaderProps) {
  return (
    <div className="border-b border-border bg-surface py-6">
      <div className="container-main">
        <Flex justify="between" align="center" wrap gap="md">
          <div className="space-y-1">
            <Heading level="h2" as="h1" className="tracking-tight text-foreground">
              {title}
            </Heading>
            {description && (
              <Text variant="small" muted>
                {description}
              </Text>
            )}
          </div>
          {action && <div className="flex items-center gap-3">{action}</div>}
        </Flex>
      </div>
    </div>
  );
}
