"use client";

import * as React from "react";
import { Plus, Edit2, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Heading, Text } from "@/components/ui/typography";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flex, Stack, Grid, Container, Section } from "@/components/layout/primitives";
import { DataTable } from "@/components/sections/data-table";
import { DashboardHeader } from "@/components/sections/dashboard-header";
import { Input, Textarea, FormField } from "@/components/sections/dashboard-form";
import { createCategory, updateCategory, deleteCategory } from "@/app/actions/dashboard";

interface Category {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  sortOrder: number;
  isActive: boolean;
}

interface CategoriesManagerProps {
  categories: Category[];
}

export function CategoriesManager({ categories }: CategoriesManagerProps) {
  const [isPending, startTransition] = React.useTransition();
  const [editingCategory, setEditingCategory] = React.useState<Category | null>(null);
  const [isCreating, setIsCreating] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Form State
  const [name, setName] = React.useState("");
  const [slug, setSlug] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [sortOrder, setSortOrder] = React.useState("0");
  const [isActive, setIsActive] = React.useState(true);

  React.useEffect(() => {
    if (editingCategory) {
      setName(editingCategory.name);
      setSlug(editingCategory.slug);
      setDescription(editingCategory.description || "");
      setSortOrder(editingCategory.sortOrder.toString());
      setIsActive(editingCategory.isActive);
      setError(null);
    } else {
      resetForm();
    }
  }, [editingCategory]);

  function resetForm() {
    setName("");
    setSlug("");
    setDescription("");
    setSortOrder("0");
    setIsActive(true);
    setError(null);
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("slug", slug);
    formData.append("description", description);
    formData.append("sortOrder", sortOrder);
    formData.append("isActive", isActive.toString());

    startTransition(async () => {
      let res;
      if (editingCategory) {
        res = await updateCategory(editingCategory.id, { success: true }, formData);
      } else {
        res = await createCategory({ success: true }, formData);
      }

      if (res.success) {
        setEditingCategory(null);
        setIsCreating(false);
        resetForm();
      } else {
        setError(res.error || "An error occurred.");
      }
    });
  }

  function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this category? This will fail if any products are currently assigned to it.")) {
      return;
    }
    startTransition(async () => {
      const res = await deleteCategory(id);
      if (!res.success) {
        alert(res.error || "Failed to delete category.");
      }
    });
  }

  return (
    <>
      <DashboardHeader
        title="Categories"
        description="Manage catalog categories to organize storefront products."
        action={
          !isCreating &&
          !editingCategory && (
            <Button onClick={() => setIsCreating(true)} size="sm">
              <Plus className="size-4 mr-2" /> Add Category
            </Button>
          )
        }
      />

      <Section spacing="sm">
        <Container size="full" className="px-4 md:px-8">
          {(isCreating || editingCategory) && (
            <Card className="mb-6 relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-4"
                onClick={() => {
                  setIsCreating(false);
                  setEditingCategory(null);
                }}
              >
                <X className="size-4" />
              </Button>

              <Heading level="h3" className="mb-6">
                {editingCategory ? "Edit Category" : "Add New Category"}
              </Heading>

              {error && (
                <div className="mb-4 rounded-xl bg-destructive/10 p-4 text-sm font-semibold text-destructive">
                  {error}
                </div>
              )}

              <form onSubmit={handleSave}>
                <Grid cols={2} gap="md" className="mb-6">
                  <FormField label="Category Name" required>
                    <Input
                      required
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        // Auto slugify if creating
                        if (!editingCategory) {
                          setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
                        }
                      }}
                      placeholder="e.g. Adapters"
                    />
                  </FormField>

                  <FormField label="Category Slug" required>
                    <Input
                      required
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      placeholder="e.g. adapters"
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
                </Grid>

                <Stack gap="md" className="mb-6">
                  <FormField label="Description">
                    <Textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Enter a brief category description..."
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
                      Category is Active and visible on Storefront filter panels
                    </label>
                  </Flex>
                </Stack>

                <Flex gap="sm" justify="end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsCreating(false);
                      setEditingCategory(null);
                    }}
                    disabled={isPending}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isPending}>
                    {isPending ? "Saving..." : "Save Category"}
                  </Button>
                </Flex>
              </form>
            </Card>
          )}

          <Card>
            {categories.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground">
                No categories found. Add one to get started!
              </div>
            ) : (
              <DataTable headers={["Category Name", "Slug", "Description", "Sort Order", "Status", "Actions"]}>
                {categories.map((c) => (
                  <tr key={c.id}>
                    <td className="px-6 py-4 font-semibold text-foreground">
                      {c.name}
                    </td>
                    <td className="px-6 py-4">{c.slug}</td>
                    <td className="px-6 py-4 max-w-xs truncate">
                      {c.description || <span className="text-muted-foreground italic">No description</span>}
                    </td>
                    <td className="px-6 py-4">{c.sortOrder}</td>
                    <td className="px-6 py-4">
                      <Badge variant={c.isActive ? "success" : "secondary"}>
                        {c.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Flex gap="xs">
                        <Button variant="ghost" size="icon" onClick={() => setEditingCategory(c)}>
                          <Edit2 className="size-4 text-muted-foreground hover:text-foreground" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(c.id)}>
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
