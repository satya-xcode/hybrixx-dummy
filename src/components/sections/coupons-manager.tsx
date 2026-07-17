"use client";

import * as React from "react";
import { Plus, Trash2, X, ToggleLeft, ToggleRight, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Heading, Text } from "@/components/ui/typography";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flex, Stack, Grid, Container, Section } from "@/components/layout/primitives";
import { DataTable } from "@/components/sections/data-table";
import { DashboardHeader } from "@/components/sections/dashboard-header";
import { Input, Select, FormField } from "@/components/sections/dashboard-form";
import { createCoupon, toggleCouponStatus, deleteCoupon } from "@/app/actions/dashboard";

interface Coupon {
  id: number;
  code: string;
  discountType: "PERCENT" | "FIXED";
  discountValue: number;
  isActive: boolean;
  createdAt: Date;
}

interface CouponsManagerProps {
  coupons: Coupon[];
}

export function CouponsManager({ coupons }: CouponsManagerProps) {
  const [isPending, startTransition] = React.useTransition();
  const [isCreating, setIsCreating] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Form State
  const [code, setCode] = React.useState("");
  const [discountType, setDiscountType] = React.useState("PERCENT");
  const [discountValue, setDiscountValue] = React.useState("");
  const [isActive, setIsActive] = React.useState(true);

  function resetForm() {
    setCode("");
    setDiscountType("PERCENT");
    setDiscountValue("");
    setIsActive(true);
    setError(null);
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const formattedCode = code.trim().toUpperCase();
    if (!formattedCode) {
      setError("Coupon Code is required.");
      return;
    }

    const val = parseInt(discountValue, 10);
    if (isNaN(val) || val <= 0) {
      setError("Discount Value must be a positive number.");
      return;
    }

    const formData = new FormData();
    formData.append("code", formattedCode);
    formData.append("discountType", discountType);
    formData.append("discountValue", discountValue);
    formData.append("isActive", isActive.toString());

    startTransition(async () => {
      const res = await createCoupon({ success: true }, formData);

      if (res.success) {
        setIsCreating(false);
        resetForm();
      } else {
        setError(res.error || "An error occurred.");
      }
    });
  }

  function handleToggleActive(id: number, currentActive: boolean) {
    startTransition(async () => {
      const res = await toggleCouponStatus(id, !currentActive);
      if (!res.success) {
        alert(res.error || "Failed to update coupon status.");
      }
    });
  }

  function handleDelete(id: number, couponCode: string) {
    if (!confirm(`Are you sure you want to delete coupon ${couponCode}?`)) {
      return;
    }
    startTransition(async () => {
      const res = await deleteCoupon(id);
      if (!res.success) {
        alert(res.error || "Failed to delete coupon.");
      }
    });
  }

  return (
    <>
      <DashboardHeader
        title="Coupons & Promo Codes"
        description="Create and manage checkout coupons to drive customer conversion."
        action={
          !isCreating && (
            <Button onClick={() => setIsCreating(true)} size="sm">
              <Plus className="size-4 mr-2" /> Add Coupon
            </Button>
          )
        }
      />

      <Section spacing="sm">
        <Container size="full" className="px-4 md:px-8">
          {isCreating && (
            <Card className="mb-6 relative animate-in fade-in slide-in-from-top-4 duration-300">
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-4"
                onClick={() => {
                  setIsCreating(false);
                  resetForm();
                }}
              >
                <X className="size-4" />
              </Button>

              <Heading level="h3" className="mb-6 flex items-center gap-2 text-foreground">
                <Ticket className="size-5 text-primary" />
                Create New Coupon
              </Heading>

              {error && (
                <div className="mb-4 rounded-xl bg-destructive/10 p-4 text-sm font-semibold text-destructive">
                  {error}
                </div>
              )}

              <form onSubmit={handleSave}>
                <Grid cols={3} gap="md" className="mb-6">
                  <FormField label="Coupon Code" required>
                    <Input
                      required
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="e.g. SUMMER30"
                      className="uppercase font-bold"
                    />
                  </FormField>

                  <FormField label="Discount Type" required>
                    <Select
                      required
                      value={discountType}
                      onChange={(e) => setDiscountType(e.target.value)}
                    >
                      <option value="PERCENT">Percentage Off (%)</option>
                      <option value="FIXED">Flat Discount (₹)</option>
                    </Select>
                  </FormField>

                  <FormField label="Discount Value" required>
                    <Input
                      required
                      type="number"
                      value={discountValue}
                      onChange={(e) => setDiscountValue(e.target.value)}
                      placeholder={discountType === "PERCENT" ? "30" : "150"}
                    />
                  </FormField>
                </Grid>

                <Stack gap="md" className="mb-6">
                  <Flex gap="sm" align="center">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="size-4 rounded border-border text-primary focus:ring-primary"
                    />
                    <label htmlFor="isActive" className="text-sm font-semibold text-foreground cursor-pointer select-none">
                      Coupon is Active and can be applied during checkout immediately
                    </label>
                  </Flex>
                </Stack>

                <Flex gap="sm" justify="end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsCreating(false);
                      resetForm();
                    }}
                    disabled={isPending}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isPending}>
                    {isPending ? "Creating..." : "Save Coupon"}
                  </Button>
                </Flex>
              </form>
            </Card>
          )}

          <Card>
            {coupons.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground">
                No coupons found. Add one to get started!
              </div>
            ) : (
              <DataTable headers={["Coupon Code", "Type", "Discount Value", "Status", "Created At", "Actions"]}>
                {coupons.map((c) => (
                  <tr key={c.id}>
                    <td className="px-6 py-4 font-bold text-foreground tracking-wide text-sm">
                      {c.code}
                    </td>
                    <td className="px-6 py-4 text-xs font-semibold text-muted-foreground">
                      {c.discountType === "PERCENT" ? "Percentage Off" : "Flat Discount"}
                    </td>
                    <td className="px-6 py-4 font-semibold text-foreground">
                      {c.discountType === "PERCENT" ? `${c.discountValue}%` : `₹${c.discountValue}`}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={c.isActive ? "success" : "secondary"}>
                        {c.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-xs text-muted-foreground">
                      {new Date(c.createdAt).toLocaleDateString("en-IN", {
                        dateStyle: "medium",
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <Flex gap="xs">
                        <Button
                          variant="ghost"
                          size="icon"
                          title={c.isActive ? "Deactivate" : "Activate"}
                          onClick={() => handleToggleActive(c.id, c.isActive)}
                          disabled={isPending}
                        >
                          {c.isActive ? (
                            <ToggleRight className="size-5 text-primary" />
                          ) : (
                            <ToggleLeft className="size-5 text-muted-foreground" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Delete"
                          onClick={() => handleDelete(c.id, c.code)}
                          disabled={isPending}
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
        </Container>
      </Section>
    </>
  );
}
