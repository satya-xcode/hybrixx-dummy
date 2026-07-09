"use client";

import * as React from "react";
import { Check, MailOpen, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Heading, Text } from "@/components/ui/typography";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Container, Section, Flex, Stack } from "@/components/layout/primitives";
import { DataTable } from "@/components/sections/data-table";
import { DashboardHeader } from "@/components/sections/dashboard-header";
import { markContactRead, deleteContact } from "@/app/actions/dashboard";

interface ContactSubmission {
  id: number;
  name: string;
  email: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

interface ContactsManagerProps {
  contacts: ContactSubmission[];
}

export function ContactsManager({ contacts }: ContactsManagerProps) {
  const [selectedContact, setSelectedContact] = React.useState<ContactSubmission | null>(null);
  const [isPending, startTransition] = React.useTransition();

  function handleToggleRead(id: number, currentRead: boolean) {
    startTransition(async () => {
      const res = await markContactRead(id, !currentRead);
      if (!res.success) {
        alert(res.error || "Failed to update read status.");
      } else if (selectedContact?.id === id) {
        setSelectedContact((prev) => prev ? { ...prev, isRead: !currentRead } : null);
      }
    });
  }

  function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this inquiry?")) return;
    startTransition(async () => {
      const res = await deleteContact(id);
      if (!res.success) {
        alert(res.error || "Failed to delete inquiry.");
      } else if (selectedContact?.id === id) {
        setSelectedContact(null);
      }
    });
  }

  return (
    <>
      <DashboardHeader
        title="Contact Inquiries"
        description="Review messages submitted from the contact page."
      />

      <Section spacing="sm">
        <Container size="full" className="px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Main List */}
          <div className="lg:col-span-2">
            <Card>
              {contacts.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground">
                  No contact inquiries yet.
                </div>
              ) : (
                <DataTable headers={["Sender", "Date", "Status", "Actions"]}>
                  {contacts.map((contact) => (
                    <tr
                      key={contact.id}
                      className={selectedContact?.id === contact.id ? "bg-[var(--surface-alt)]" : ""}
                    >
                      <td className="px-6 py-4">
                        <Stack gap="xs">
                          <span className="font-semibold text-foreground">
                            {contact.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {contact.email}
                          </span>
                        </Stack>
                      </td>
                      <td className="px-6 py-4 text-xs text-muted-foreground">
                        {new Date(contact.createdAt).toLocaleDateString("en-IN", {
                          dateStyle: "medium",
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={contact.isRead ? "secondary" : "default"}>
                          {contact.isRead ? "Read" : "Unread"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Flex gap="xs">
                          <Button
                            variant="ghost"
                            size="icon"
                            title="View inquiry details"
                            onClick={() => {
                              setSelectedContact(contact);
                              if (!contact.isRead) {
                                handleToggleRead(contact.id, false);
                              }
                            }}
                          >
                            <Eye className="size-4 text-muted-foreground hover:text-foreground" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            title={contact.isRead ? "Mark as unread" : "Mark as read"}
                            onClick={() => handleToggleRead(contact.id, contact.isRead)}
                          >
                            {contact.isRead ? (
                              <MailOpen className="size-4 text-muted-foreground hover:text-foreground" />
                            ) : (
                              <Check className="size-4 text-primary hover:text-primary-hover" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Delete"
                            onClick={() => handleDelete(contact.id)}
                          >
                            <Trash2 className="size-4 text-destructive hover:text-destructive/80" />
                          </Button>
                        </Flex>
                      </td>
                    </tr>
                  ))}
                </DataTable>
              )}
            </Card>
          </div>

          {/* Details Sidebar Pane */}
          <div className="lg:col-span-1">
            {selectedContact ? (
              <Card className="flex flex-col gap-4">
                <div>
                  <h4 className="text-lg font-bold text-foreground">
                    Inquiry Details
                  </h4>
                  <Text variant="xs" muted className="mt-1">
                    Received on{" "}
                    {new Date(selectedContact.createdAt).toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </Text>
                </div>

                <div className="border-t border-border pt-4 space-y-3">
                  <div>
                    <span className="text-xs font-semibold uppercase text-muted-foreground">
                      Name
                    </span>
                    <p className="text-sm font-semibold text-foreground">
                      {selectedContact.name}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs font-semibold uppercase text-muted-foreground">
                      Email
                    </span>
                    <p className="text-sm font-semibold text-foreground">
                      {selectedContact.email}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs font-semibold uppercase text-muted-foreground">
                      Message
                    </span>
                    <div className="mt-1 rounded-xl bg-[var(--surface-alt)] p-4 text-sm text-foreground whitespace-pre-wrap leading-relaxed border border-border">
                      {selectedContact.message}
                    </div>
                  </div>
                </div>

                <div className="border-t border-border pt-4 flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    size="sm"
                    onClick={() =>
                      handleToggleRead(selectedContact.id, selectedContact.isRead)
                    }
                  >
                    {selectedContact.isRead ? "Mark Unread" : "Mark Read"}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(selectedContact.id)}
                  >
                    Delete
                  </Button>
                </div>
              </Card>
            ) : (
              <Card className="items-center text-center py-12 text-muted-foreground">
                <p className="text-sm">
                  Select an inquiry from the table to view the full message body.
                </p>
              </Card>
            )}
          </div>
        </div>
      </Container>
    </Section>
    </>
  );
}
