"use client";

import * as React from "react";
import { Plus, Edit2, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Heading, Text } from "@/components/ui/typography";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Container, Section, Flex, Stack, Grid } from "@/components/layout/primitives";
import { DataTable } from "@/components/sections/data-table";
import { DashboardHeader } from "@/components/sections/dashboard-header";
import { Input, Textarea, FormField } from "@/components/sections/dashboard-form";
import { createFAQ, updateFAQ, deleteFAQ } from "@/app/actions/dashboard";

interface FAQ {
  id: number;
  question: string;
  answer: string;
  sortOrder: number;
  isActive: boolean;
}

interface FaqsManagerProps {
  faqs: FAQ[];
}

export function FaqsManager({ faqs }: FaqsManagerProps) {
  const [isPending, startTransition] = React.useTransition();
  const [editingFaq, setEditingFaq] = React.useState<FAQ | null>(null);
  const [isCreating, setIsCreating] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Form State
  const [question, setQuestion] = React.useState("");
  const [answer, setAnswer] = React.useState("");
  const [sortOrder, setSortOrder] = React.useState("0");
  const [isActive, setIsActive] = React.useState(true);

  React.useEffect(() => {
    if (editingFaq) {
      setQuestion(editingFaq.question);
      setAnswer(editingFaq.answer);
      setSortOrder(editingFaq.sortOrder.toString());
      setIsActive(editingFaq.isActive);
      setError(null);
    } else {
      resetForm();
    }
  }, [editingFaq]);

  function resetForm() {
    setQuestion("");
    setAnswer("");
    setSortOrder("0");
    setIsActive(true);
    setError(null);
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const formData = new FormData();
    formData.append("question", question);
    formData.append("answer", answer);
    formData.append("sortOrder", sortOrder);
    formData.append("isActive", isActive.toString());

    startTransition(async () => {
      let res;
      if (editingFaq) {
        res = await updateFAQ(editingFaq.id, { success: true }, formData);
      } else {
        res = await createFAQ({ success: true }, formData);
      }

      if (res.success) {
        setEditingFaq(null);
        setIsCreating(false);
        resetForm();
      } else {
        setError(res.error || "An error occurred.");
      }
    });
  }

  function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this FAQ?")) return;
    startTransition(async () => {
      const res = await deleteFAQ(id);
      if (!res.success) {
        alert(res.error || "Failed to delete FAQ.");
      }
    });
  }

  return (
    <>
      <DashboardHeader
        title="Frequently Asked Questions"
        description="Manage the FAQs page database."
        action={
          !isCreating &&
          !editingFaq && (
            <Button onClick={() => setIsCreating(true)} size="sm">
              <Plus className="size-4 mr-2" /> Add FAQ
            </Button>
          )
        }
      />

      <Section spacing="sm">
        <Container size="full" className="px-4 md:px-8">
        {(isCreating || editingFaq) && (
          <Card className="mb-6 relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4"
              onClick={() => {
                setIsCreating(false);
                setEditingFaq(null);
              }}
            >
              <X className="size-4" />
            </Button>

            <Heading level="h3" className="mb-6">
              {editingFaq ? "Edit FAQ" : "Add New FAQ"}
            </Heading>

            {error && (
              <div className="mb-4 rounded-xl bg-destructive/10 p-4 text-sm font-semibold text-destructive">
                {error}
              </div>
            )}

            <form onSubmit={handleSave}>
              <Stack gap="md" className="mb-6">
                <FormField label="Question" required>
                  <Input
                    required
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="e.g. How long does shipping take?"
                  />
                </FormField>

                <FormField label="Answer" required>
                  <Textarea
                    required
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="e.g. Orders placed before 2pm IST ship the same day..."
                  />
                </FormField>

                <FormField label="Sort Order" required>
                  <Input
                    required
                    type="number"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    placeholder="0"
                  />
                </FormField>

                <Flex gap="sm" align="center">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="size-4 rounded border-border text-primary focus:ring-primary"
                  />
                  <label htmlFor="isActive" className="text-sm font-semibold text-foreground">
                    FAQ is Active and visible on Storefront
                  </label>
                </Flex>
              </Stack>

              <Flex gap="sm" justify="end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsCreating(false);
                    setEditingFaq(null);
                  }}
                  disabled={isPending}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Saving..." : "Save FAQ"}
                </Button>
              </Flex>
            </form>
          </Card>
        )}

        <Card>
          {faqs.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              No FAQs found. Add one to get started!
            </div>
          ) : (
            <DataTable headers={["FAQ Question", "Answer Summary", "Sort Order", "Status", "Actions"]}>
              {faqs.map((faq) => (
                <tr key={faq.id}>
                  <td className="px-6 py-4 font-semibold text-foreground max-w-xs truncate">
                    {faq.question}
                  </td>
                  <td className="px-6 py-4 max-w-sm truncate">
                    {faq.answer}
                  </td>
                  <td className="px-6 py-4">{faq.sortOrder}</td>
                  <td className="px-6 py-4">
                    <Badge variant={faq.isActive ? "success" : "secondary"}>
                      {faq.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Flex gap="xs">
                      <Button variant="ghost" size="icon" onClick={() => setEditingFaq(faq)}>
                        <Edit2 className="size-4 text-muted-foreground hover:text-foreground" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(faq.id)}>
                        <Trash2 className="size-4 text-destructive hover:text-destructive/80" />
                      </Button>
                    </Flex>
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
