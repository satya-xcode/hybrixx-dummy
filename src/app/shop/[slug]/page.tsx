import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Check, Star } from "lucide-react";
import { Container, Section, Stack, Grid, Flex } from "@/components/layout/primitives";
import { Heading, Text } from "@/components/ui/typography";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollReveal, ScrollRevealItem } from "@/components/motion/scroll-reveal";
import { ProductCard, formatINR } from "@/components/sections/product-card";
import { products, siteConfig } from "@/config/site";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);
  if (!product) return {};
  return {
    title: `${product.name} — ${siteConfig.name}`,
    description: product.blurb,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);
  if (!product) notFound();

  const related = products.filter((p) => p.slug !== product.slug).slice(0, 3);

  return (
    <>
      <Section spacing="sm" className="border-b border-border">
        <Container size="lg">
          <Flex gap="xs" className="text-sm text-muted-foreground">
            <Link href="/shop" className="hover:text-foreground">
              Shop
            </Link>
            <ChevronRight className="size-3.5" />
            <Text variant="small" className="text-foreground">
              {product.name}
            </Text>
          </Flex>
        </Container>
      </Section>

      <Section>
        <Container size="lg">
          <ScrollReveal>
            <Grid cols={2} gap="lg">
              {/* Placeholder product "image" — swap for next/image in a real build */}
              <div className="aspect-square w-full rounded-2xl bg-muted" />

              <Stack gap="md">
                {product.badge && (
                  <Badge className="w-fit">{product.badge}</Badge>
                )}
                <Heading level="h1">{product.name}</Heading>

                <Flex gap="xs">
                  <Flex gap="xs" className="gap-0.5">
                    {Array.from({ length: Math.round(product.rating) }).map(
                      (_, i) => (
                        <Star
                          key={i}
                          className="size-4 fill-warning text-warning"
                        />
                      )
                    )}
                  </Flex>
                  <Text variant="small" muted>
                    {product.rating} ({product.reviewCount} reviews)
                  </Text>
                </Flex>

                <Flex gap="sm" align="end">
                  <Text className="text-h2 font-bold">
                    {formatINR(product.price)}
                  </Text>
                  {product.compareAtPrice && (
                    <Text variant="lead" muted className="line-through">
                      {formatINR(product.compareAtPrice)}
                    </Text>
                  )}
                </Flex>

                <Text variant="body" muted>
                  {product.description}
                </Text>

                <Stack gap="xs">
                  {product.features.map((feature) => (
                    <Flex key={feature} gap="sm" align="start">
                      <Check className="mt-0.5 size-4 shrink-0 text-accent" />
                      <Text variant="small">{feature}</Text>
                    </Flex>
                  ))}
                </Stack>

                <Flex gap="sm" wrap className="mt-2">
                  <Button size="lg">Add to cart</Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/shop">Continue shopping</Link>
                  </Button>
                </Flex>
                <Text variant="xs" muted>
                  Free shipping on orders over ₹1,999 · 1-year replacement warranty
                </Text>
              </Stack>
            </Grid>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <Card className="mt-16">
              <Stack gap="sm">
                <Heading level="h3">Specs</Heading>
                <Stack gap="xs">
                  {product.specs.map((spec) => (
                    <Flex
                      key={spec.label}
                      justify="between"
                      className="border-b border-border py-2 last:border-0"
                    >
                      <Text variant="small" muted>
                        {spec.label}
                      </Text>
                      <Text variant="small" className="font-medium">
                        {spec.value}
                      </Text>
                    </Flex>
                  ))}
                </Stack>
              </Stack>
            </Card>
          </ScrollReveal>
        </Container>
      </Section>

      {related.length > 0 && (
        <Section spacing="md" className="bg-muted/40">
          <Container size="lg">
            <Stack gap="lg">
              <ScrollReveal>
                <Heading level="h2">You might also like</Heading>
              </ScrollReveal>
              <ScrollReveal stagger>
                <Grid cols={3} gap="md">
                  {related.map((p) => (
                    <ScrollRevealItem key={p.id}>
                      <ProductCard product={p} />
                    </ScrollRevealItem>
                  ))}
                </Grid>
              </ScrollReveal>
            </Stack>
          </Container>
        </Section>
      )}
    </>
  );
}
