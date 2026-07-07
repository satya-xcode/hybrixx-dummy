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
import { AddToCartButton } from "@/components/sections/add-to-cart-button";
import { getProductBySlug, getProducts, getProductSlugs } from "@/lib/data/products";
import { siteConfig } from "@/config/site";

export async function generateStaticParams() {
  const slugs = await getProductSlugs();
  return slugs;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return {
    title: `${product.name} — ${siteConfig.name}`,
    description: product.blurb,
    alternates: { canonical: `/shop/${slug}` },
    openGraph: {
      title: `${product.name} — ${siteConfig.name}`,
      description: product.blurb,
      type: "website",
      url: `${siteConfig.url}/shop/${slug}`,
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const allProducts = await getProducts();
  const related = allProducts.filter((p) => p.slug !== product.slug).slice(0, 3);

  // JSON-LD Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${siteConfig.url}/shop/${product.slug}`,
    name: product.name,
    description: product.blurb,
    brand: { "@type": "Brand", name: siteConfig.name },
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
      url: `${siteConfig.url}/shop/${product.slug}`,
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
    },
  };

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

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
                  <AddToCartButton productId={product.id} size="lg" />
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
