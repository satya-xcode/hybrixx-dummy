import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { Suspense } from "react";
import { ShoppingBag, ArrowRight, Trash2, Plus, Minus } from "lucide-react";
import { Container, Section, Stack, Grid, Flex } from "@/components/layout/primitives";
import { Heading, Text } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { PageHeader } from "@/components/sections/page-header";
import { getCartItems, getAppliedCouponForSession } from "@/lib/data/cart";
import { CouponForm } from "@/components/sections/coupon-form";
import { formatINR } from "@/components/sections/product-card";
import { CartItemActions } from "@/components/sections/cart-item-actions";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `Cart — ${siteConfig.name}`,
  description: "Review your cart before checkout.",
};

async function CartContent() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("cart_session")?.value;

  if (!sessionId) {
    return <EmptyCart />;
  }

  const [items, appliedCoupon] = await Promise.all([
    getCartItems(sessionId),
    getAppliedCouponForSession(sessionId),
  ]);

  if (items.length === 0) {
    return <EmptyCart />;
  }

  const subtotal = items.reduce(
    (sum, item) => sum + (item.productPrice ?? 0) * item.quantity,
    0
  );

  let discount = 0;
  if (appliedCoupon && appliedCoupon.isActive) {
    if (appliedCoupon.discountType === "PERCENT") {
      discount = Math.round((subtotal * appliedCoupon.discountValue) / 100);
    } else {
      discount = appliedCoupon.discountValue;
    }
  }

  const discountText = appliedCoupon
    ? appliedCoupon.discountType === "PERCENT"
      ? `${appliedCoupon.discountValue}%`
      : formatINR(appliedCoupon.discountValue)
    : "";

  const shipping = subtotal >= 1999 ? 0 : 99;
  const total = Math.max(0, subtotal - discount + shipping);

  return (
    <Section>
      <Container size="lg">
        <ScrollReveal>
          <Grid cols={2} gap="lg" className="items-start">
            {/* Cart Items */}
            <Stack gap="sm">
              {items.map((item) => (
                <Card key={item.id} className="flex-row items-center gap-4">
                  {/* Product placeholder */}
                  <div className="size-20 shrink-0 rounded-xl bg-muted" />

                  <Stack gap="xs" className="flex-1">
                    <Link
                      href={`/shop/${item.productSlug}`}
                      className="font-medium hover:text-primary"
                    >
                      {item.productName}
                    </Link>
                    <Text variant="xs" muted>
                      {item.productBlurb}
                    </Text>
                    <Text variant="small" className="font-semibold">
                      {formatINR(item.productPrice ?? 0)}
                    </Text>
                  </Stack>

                  <CartItemActions itemId={item.id} quantity={item.quantity} />
                </Card>
              ))}
            </Stack>

            {/* Order Summary */}
            <Card className="sticky top-24">
              <Stack gap="md">
                <Heading level="h3">Order Summary</Heading>

                <Stack gap="xs">
                  <Flex justify="between">
                    <Text variant="small" muted>
                      Subtotal
                    </Text>
                    <Text variant="small" className="font-medium">
                      {formatINR(subtotal)}
                    </Text>
                  </Flex>
                  {discount > 0 && (
                    <Flex justify="between" className="text-primary font-medium">
                      <Text variant="small">
                        Discount ({appliedCoupon?.code})
                      </Text>
                      <Text variant="small">
                        -{formatINR(discount)}
                      </Text>
                    </Flex>
                  )}
                  <Flex justify="between">
                    <Text variant="small" muted>
                      Shipping
                    </Text>
                    <Text variant="small" className="font-medium">
                      {shipping === 0 ? "Free" : formatINR(shipping)}
                    </Text>
                  </Flex>
                  <div className="border-t border-border pt-2">
                    <Flex justify="between">
                      <Text className="font-semibold">Total</Text>
                      <Text className="font-semibold">
                        {formatINR(total)}
                      </Text>
                    </Flex>
                  </div>
                </Stack>

                <CouponForm
                  appliedCouponCode={appliedCoupon?.code}
                  appliedDiscountText={discountText}
                />

                <Button size="lg" className="w-full">
                  Proceed to Checkout
                </Button>

                {subtotal < 1999 && (
                  <Text variant="xs" muted className="text-center">
                    Add {formatINR(1999 - subtotal)} more for free shipping
                  </Text>
                )}
              </Stack>
            </Card>
          </Grid>
        </ScrollReveal>
      </Container>
    </Section>
  );
}

function EmptyCart() {
  return (
    <Section>
      <Container size="md">
        <Stack gap="md" align="center" className="py-16 text-center">
          <ShoppingBag className="size-16 text-muted-foreground/50" />
          <Heading level="h2">Your cart is empty</Heading>
          <Text variant="lead" muted>
            Add some gear and come back.
          </Text>
          <Button size="lg" asChild>
            <Link href="/shop">
              Shop the collection
              <ArrowRight />
            </Link>
          </Button>
        </Stack>
      </Container>
    </Section>
  );
}

export default function CartPage() {
  return (
    <>
      <PageHeader
        eyebrow="Cart"
        title="Your gear"
        description="Review and update your cart before checkout."
      />
      <Suspense
        fallback={
          <Section>
            <Container size="lg">
              <Stack gap="sm" align="center" className="py-16">
                <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                <Text variant="small" muted>
                  Loading your cart...
                </Text>
              </Stack>
            </Container>
          </Section>
        }
      >
        <CartContent />
      </Suspense>
    </>
  );
}
