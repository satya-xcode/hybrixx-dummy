"use client";

import * as React from "react";
import { Trash2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container, Section, Stack, Flex } from "@/components/layout/primitives";
import { DataTable } from "@/components/sections/data-table";
import { DashboardHeader } from "@/components/sections/dashboard-header";
import { deleteSubscriber } from "@/app/actions/dashboard";

interface Subscriber {
  id: number;
  email: string;
  createdAt: Date;
}

interface NewsletterManagerProps {
  subscribers: Subscriber[];
}

export function NewsletterManager({ subscribers }: NewsletterManagerProps) {
  const [isPending, startTransition] = React.useTransition();

  function handleDelete(id: number) {
    if (!confirm("Are you sure you want to remove this email from the newsletter list?")) {
      return;
    }
    startTransition(async () => {
      const res = await deleteSubscriber(id);
      if (!res.success) {
        alert(res.error || "Failed to remove subscriber.");
      }
    });
  }

  return (
    <>
      <DashboardHeader
        title="Newsletter Subscribers"
        description="Review email subscribers and download lists."
      />

      <Section spacing="sm">
        <Container size="full" className="px-4 md:px-8">
        <Card>
          {subscribers.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              No newsletter subscribers yet.
            </div>
          ) : (
            <DataTable headers={["Email Address", "Subscription Date", "Actions"]}>
              {subscribers.map((sub) => (
                <tr key={sub.id}>
                  <td className="px-6 py-4 font-semibold text-foreground">
                    <Flex gap="sm">
                      <Mail className="size-4 text-muted-foreground" />
                      <span>{sub.email}</span>
                    </Flex>
                  </td>
                  <td className="px-6 py-4 text-xs text-muted-foreground">
                    {new Date(sub.createdAt).toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </td>
                  <td className="px-6 py-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Remove Subscriber"
                      onClick={() => handleDelete(sub.id)}
                    >
                      <Trash2 className="size-4 text-destructive hover:text-destructive/80" />
                    </Button>
                  </td>
                </tr>
              ))}
            </DataTable>
          )}
        </Card>
      </Container>
    </Section>
    </>
  );
}
