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
import { Input, Textarea, Select, FormField } from "@/components/sections/dashboard-form";
import { createTestimonial, updateTestimonial, deleteTestimonial } from "@/app/actions/dashboard";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  quote: string;
  rating: number;
  isActive: boolean;
}

interface TestimonialsManagerProps {
  testimonials: Testimonial[];
}

export function TestimonialsManager({ testimonials }: TestimonialsManagerProps) {
  const [isPending, startTransition] = React.useTransition();
  const [editingTestimonial, setEditingTestimonial] = React.useState<Testimonial | null>(null);
  const [isCreating, setIsCreating] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Form State
  const [name, setName] = React.useState("");
  const [role, setRole] = React.useState("");
  const [quote, setQuote] = React.useState("");
  const [rating, setRating] = React.useState("5");
  const [isActive, setIsActive] = React.useState(true);

  React.useEffect(() => {
    if (editingTestimonial) {
      setName(editingTestimonial.name);
      setRole(editingTestimonial.role);
      setQuote(editingTestimonial.quote);
      setRating(editingTestimonial.rating.toString());
      setIsActive(editingTestimonial.isActive);
      setError(null);
    } else {
      resetForm();
    }
  }, [editingTestimonial]);

  function resetForm() {
    setName("");
    setRole("");
    setQuote("");
    setRating("5");
    setIsActive(true);
    setError(null);
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("role", role);
    formData.append("quote", quote);
    formData.append("rating", rating);
    formData.append("isActive", isActive.toString());

    startTransition(async () => {
      let res;
      if (editingTestimonial) {
        res = await updateTestimonial(editingTestimonial.id, { success: true }, formData);
      } else {
        res = await createTestimonial({ success: true }, formData);
      }

      if (res.success) {
        setEditingTestimonial(null);
        setIsCreating(false);
        resetForm();
      } else {
        setError(res.error || "An error occurred.");
      }
    });
  }

  function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;
    startTransition(async () => {
      const res = await deleteTestimonial(id);
      if (!res.success) {
        alert(res.error || "Failed to delete testimonial.");
      }
    });
  }

  return (
    <>
      <DashboardHeader
        title="Testimonials"
        description="Manage the customer review testimonials panel."
        action={
          !isCreating &&
          !editingTestimonial && (
            <Button onClick={() => setIsCreating(true)} size="sm">
              <Plus className="size-4 mr-2" /> Add Testimonial
            </Button>
          )
        }
      />

      <Section spacing="sm">
        <Container size="full" className="px-4 md:px-8">
        {(isCreating || editingTestimonial) && (
          <Card className="mb-6 relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4"
              onClick={() => {
                setIsCreating(false);
                setEditingTestimonial(null);
              }}
            >
              <X className="size-4" />
            </Button>

            <Heading level="h3" className="mb-6">
              {editingTestimonial ? "Edit Testimonial" : "Add New Testimonial"}
            </Heading>

            {error && (
              <div className="mb-4 rounded-xl bg-destructive/10 p-4 text-sm font-semibold text-destructive">
                {error}
              </div>
            )}

            <form onSubmit={handleSave}>
              <Grid cols={2} gap="md" className="mb-6">
                <FormField label="Reviewer Name" required>
                  <Input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rohan K."
                  />
                </FormField>

                <FormField label="Reviewer Role / Title" required>
                  <Input
                    required
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. Software Engineer"
                  />
                </FormField>

                <FormField label="Rating (1-5 Stars)" required>
                  <Select value={rating} onChange={(e) => setRating(e.target.value)}>
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="2">2 Stars</option>
                    <option value="1">1 Star</option>
                  </Select>
                </FormField>
              </Grid>

              <Stack gap="md" className="mb-6">
                <FormField label="Review Quote / Feedback" required>
                  <Textarea
                    required
                    value={quote}
                    onChange={(e) => setQuote(e.target.value)}
                    placeholder="e.g. The cable survived a full year in my backpack..."
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
                    Testimonial is Active and visible on Storefront
                  </label>
                </Flex>
              </Stack>

              <Flex gap="sm" justify="end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsCreating(false);
                    setEditingTestimonial(null);
                  }}
                  disabled={isPending}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Saving..." : "Save Testimonial"}
                </Button>
              </Flex>
            </form>
          </Card>
        )}

        <Card>
          {testimonials.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              No testimonials found. Add one to get started!
            </div>
          ) : (
            <DataTable headers={["Reviewer", "Quote Detail", "Rating", "Status", "Actions"]}>
              {testimonials.map((t) => (
                <tr key={t.id}>
                  <td className="px-6 py-4">
                    <Stack gap="xs">
                      <span className="font-semibold text-foreground">{t.name}</span>
                      <span className="text-xs text-muted-foreground">{t.role}</span>
                    </Stack>
                  </td>
                  <td className="px-6 py-4 max-w-md truncate">
                    &ldquo;{t.quote}&rdquo;
                  </td>
                  <td className="px-6 py-4 font-semibold">{t.rating}★</td>
                  <td className="px-6 py-4">
                    <Badge variant={t.isActive ? "success" : "secondary"}>
                      {t.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Flex gap="xs">
                      <Button variant="ghost" size="icon" onClick={() => setEditingTestimonial(t)}>
                        <Edit2 className="size-4 text-muted-foreground hover:text-foreground" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(t.id)}>
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
