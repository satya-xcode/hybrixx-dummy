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
import { getActiveCategories } from "@/lib/data/dashboard";
import { siteConfig } from "@/config/site";
import { getProductSchema, getBreadcrumbSchema } from "@/lib/seo/json-ld";

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
  const [product, categories] = await Promise.all([
    getProductBySlug(slug),
    getActiveCategories(),
  ]);
  if (!product) return {};

  // Resolve category name from DB
  const catObj = categories.find((c) => c.slug === product.category);
  const catName = catObj?.name ?? product.category;

  const title = `${product.name} — Buy ${catName} Online`;
  const description = `${product.blurb} ₹${product.price.toLocaleString("en-IN")} with free shipping over ₹1,999. ${product.rating}★ rating from ${product.reviewCount} reviews. 1-year replacement warranty.`;

  return {
    title,
    description,
    keywords: [
      product.name,
      catName,
      `buy ${catName.toLowerCase()} online`,
      `${siteConfig.name} ${catName.toLowerCase()}`,
      "D2C electronics India",
      "premium electronics",
    ],
    alternates: { canonical: `${siteConfig.url}/shop/${slug}` },
    openGraph: {
      title: `${product.name} — ${siteConfig.name}`,
      description,
      type: "website",
      url: `${siteConfig.url}/shop/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} — ${siteConfig.name}`,
      description: product.blurb,
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

  const [allProducts, categories] = await Promise.all([
    getProducts(),
    getActiveCategories(),
  ]);
  const related = allProducts
    .filter((p) => p.category === product.category && p.slug !== product.slug)
    .slice(0, 3);

  // Resolve category display name from DB
  const catObj = categories.find((c) => c.slug === product.category);
  const catName = catObj?.name ?? product.category;

  // JSON-LD: Product schema (with shipping, returns, ratings)
  const productSchema = getProductSchema(product, catName);

  // JSON-LD: BreadcrumbList — with category step (Google displays breadcrumbs in SERPs)
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: siteConfig.url },
    { name: "Shop", url: `${siteConfig.url}/shop` },
    { name: catName, url: `${siteConfig.url}/shop?category=${product.category}` },
    { name: product.name, url: `${siteConfig.url}/shop/${product.slug}` },
  ]);

  return (
    <>
      {/* JSON-LD: Product + BreadcrumbList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([productSchema, breadcrumbSchema]),
        }}
      />

      <Section spacing="sm" className="border-b border-border">
        <Container size="lg">
          {/* Visible breadcrumb navigation (semantic <nav>) */}
          <nav aria-label="Breadcrumb">
            <Flex gap="xs" className="text-sm text-muted-foreground">
              <Link href="/" className="hover:text-foreground">
                Home
              </Link>
              <ChevronRight className="size-3.5" />
              <Link href="/shop" className="hover:text-foreground">
                Shop
              </Link>
              <ChevronRight className="size-3.5" />
              <Link href={`/shop?category=${product.category}`} className="hover:text-foreground">
                {catName}
              </Link>
              <ChevronRight className="size-3.5" />
              <Text variant="small" className="text-foreground" aria-current="page">
                {product.name}
              </Text>
            </Flex>
          </nav>
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
