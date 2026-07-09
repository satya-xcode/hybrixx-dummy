"use client";

import * as React from "react";
import { Plus, Edit2, Trash2, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Heading, Text } from "@/components/ui/typography";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Container, Section, Flex, Stack, Grid } from "@/components/layout/primitives";
import { DataTable } from "@/components/sections/data-table";
import { DashboardHeader } from "@/components/sections/dashboard-header";
import { Input, Textarea, Select, FormField } from "@/components/sections/dashboard-form";
import { createProduct, updateProduct, deleteProduct } from "@/app/actions/dashboard";
import { formatINR } from "@/components/sections/product-card";

interface Product {
  id: number;
  slug: string;
  category: string;
  name: string;
  price: number;
  compareAtPrice: number | null;
  rating: number;
  reviewCount: number;
  badge: string | null;
  blurb: string;
  description: string;
  features: string[];
  specs: { label: string; value: string }[];
  isActive: boolean;
}

interface CategoryItem {
  id: number;
  slug: string;
  name: string;
}

interface ProductsManagerProps {
  products: Product[];
  categories: CategoryItem[];
}

export function ProductsManager({ products, categories }: ProductsManagerProps) {
  const [isPending, startTransition] = React.useTransition();
  const [editingProduct, setEditingProduct] = React.useState<Product | null>(null);
  const [isCreating, setIsCreating] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Form State
  const [name, setName] = React.useState("");
  const [category, setCategory] = React.useState(categories[0]?.slug || "charger");
  const [price, setPrice] = React.useState("");
  const [compareAtPrice, setCompareAtPrice] = React.useState("");
  const [rating, setRating] = React.useState("5.0");
  const [reviewCount, setReviewCount] = React.useState("0");
  const [badge, setBadge] = React.useState("");
  const [blurb, setBlurb] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [features, setFeatures] = React.useState("");
  const [specs, setSpecs] = React.useState("");
  const [isActive, setIsActive] = React.useState(true);

  React.useEffect(() => {
    if (editingProduct) {
      setName(editingProduct.name);
      setCategory(editingProduct.category);
      setPrice(editingProduct.price.toString());
      setCompareAtPrice(editingProduct.compareAtPrice?.toString() || "");
      setRating(editingProduct.rating.toString());
      setReviewCount(editingProduct.reviewCount.toString());
      setBadge(editingProduct.badge || "");
      setBlurb(editingProduct.blurb);
      setDescription(editingProduct.description);
      setFeatures(editingProduct.features.join("\n"));
      setSpecs(editingProduct.specs.map((s) => `${s.label}: ${s.value}`).join("\n"));
      setIsActive(editingProduct.isActive);
      setError(null);
    } else {
      resetForm();
    }
  }, [editingProduct]);

  function resetForm() {
    setName("");
    setCategory(categories[0]?.slug || "charger");
    setPrice("");
    setCompareAtPrice("");
    setRating("5.0");
    setReviewCount("0");
    setBadge("");
    setBlurb("");
    setDescription("");
    setFeatures("");
    setSpecs("");
    setIsActive(true);
    setError(null);
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("category", category);
    formData.append("price", price);
    if (compareAtPrice) formData.append("compareAtPrice", compareAtPrice);
    formData.append("rating", rating);
    formData.append("reviewCount", reviewCount);
    formData.append("badge", badge);
    formData.append("blurb", blurb);
    formData.append("description", description);
    formData.append("features", features);
    formData.append("specs", specs);
    formData.append("isActive", isActive.toString());

    startTransition(async () => {
      let res;
      if (editingProduct) {
        res = await updateProduct(editingProduct.id, { success: true }, formData);
      } else {
        res = await createProduct({ success: true }, formData);
      }

      if (res.success) {
        setEditingProduct(null);
        setIsCreating(false);
        resetForm();
      } else {
        setError(res.error || "An error occurred.");
      }
    });
  }

  function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this product? This will remove features and specs as well.")) {
      return;
    }
    startTransition(async () => {
      const res = await deleteProduct(id);
      if (!res.success) {
        alert(res.error || "Failed to delete product.");
      }
    });
  }

  return (
    <>
      <DashboardHeader
        title="Products"
        description="Manage the Nomad D2C catalog."
        action={
          !isCreating &&
          !editingProduct && (
            <Button onClick={() => setIsCreating(true)} size="sm">
              <Plus className="size-4 mr-2" /> Add Product
            </Button>
          )
        }
      />

      <Section spacing="sm">
        <Container size="full" className="px-4 md:px-8">
        {(isCreating || editingProduct) && (
          <Card className="mb-6 relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4"
              onClick={() => {
                setIsCreating(false);
                setEditingProduct(null);
              }}
            >
              <X className="size-4" />
            </Button>

            <Heading level="h3" className="mb-6">
              {editingProduct ? "Edit Product" : "Add New Product"}
            </Heading>

            {error && (
              <div className="mb-4 rounded-xl bg-destructive/10 p-4 text-sm font-semibold text-destructive">
                {error}
              </div>
            )}

            <form onSubmit={handleSave}>
              <Grid cols={2} gap="md" className="mb-6">
                <FormField label="Product Name" required>
                  <Input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. 65W GaN Charger"
                  />
                </FormField>

                <FormField label="Category" required>
                  <Select value={category} onChange={(e) => setCategory(e.target.value)}>
                    {categories.map((c) => (
                      <option key={c.id} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </Select>
                </FormField>

                <FormField label="Price (INR, e.g. 2499)" required>
                  <Input
                    required
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="2499"
                  />
                </FormField>

                <FormField label="Compare-At Price (Optional)">
                  <Input
                    type="number"
                    value={compareAtPrice}
                    onChange={(e) => setCompareAtPrice(e.target.value)}
                    placeholder="3499"
                  />
                </FormField>

                <FormField label="Initial Rating (e.g. 4.8)" required>
                  <Input
                    required
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                  />
                </FormField>

                <FormField label="Review Count" required>
                  <Input
                    required
                    type="number"
                    value={reviewCount}
                    onChange={(e) => setReviewCount(e.target.value)}
                  />
                </FormField>

                <FormField label="Badge (e.g. Bestseller, New, Optional)">
                  <Input
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    placeholder="Bestseller"
                  />
                </FormField>

                <FormField label="Short Blurb" required>
                  <Input
                    required
                    value={blurb}
                    onChange={(e) => setBlurb(e.target.value)}
                    placeholder="Pocket-sized, laptop-fast. Charges 3 devices at once."
                  />
                </FormField>
              </Grid>

              <Stack gap="md" className="mb-6">
                <FormField label="Long Description" required>
                  <Textarea
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="GaN (gallium nitride) packs more power..."
                  />
                </FormField>

                <FormField label="Features (One per line)">
                  <Textarea
                    value={features}
                    onChange={(e) => setFeatures(e.target.value)}
                    placeholder="65W total output across 2 USB-C + 1 USB-A port&#10;Charges a 13'' laptop, phone, and earbuds at once"
                  />
                </FormField>

                <FormField label="Specs (Format: 'Label: Value', One per line)">
                  <Textarea
                    value={specs}
                    onChange={(e) => setSpecs(e.target.value)}
                    placeholder="Output: 65W max (PD 3.0)&#10;Ports: 2x USB-C, 1x USB-A"
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
                    Product is Active and visible on Storefront
                  </label>
                </Flex>
              </Stack>

              <Flex gap="sm" justify="end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsCreating(false);
                    setEditingProduct(null);
                  }}
                  disabled={isPending}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Saving..." : "Save Product"}
                </Button>
              </Flex>
            </form>
          </Card>
        )}

        <Card>
          {products.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              No products found in catalog. Add one to get started!
            </div>
          ) : (
            <DataTable headers={["Product", "Category", "Price", "Rating", "Status", "Actions"]}>
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4">
                    <Stack gap="xs">
                      <span className="font-semibold text-foreground">{product.name}</span>
                      <span className="text-xs text-muted-foreground">{product.slug}</span>
                    </Stack>
                  </td>
                  <td className="px-6 py-4 capitalize">{product.category}</td>
                  <td className="px-6 py-4">
                    <Flex gap="xs">
                      <span className="font-semibold">{formatINR(product.price)}</span>
                      {product.compareAtPrice && (
                        <span className="text-xs text-muted-foreground line-through">
                          {formatINR(product.compareAtPrice)}
                        </span>
                      )}
                    </Flex>
                  </td>
                  <td className="px-6 py-4">
                    {product.rating}★ ({product.reviewCount})
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={product.isActive ? "success" : "secondary"}>
                      {product.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Flex gap="xs">
                      <Button variant="ghost" size="icon" onClick={() => setEditingProduct(product)}>
                        <Edit2 className="size-4 text-muted-foreground hover:text-foreground" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(product.id)}>
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
