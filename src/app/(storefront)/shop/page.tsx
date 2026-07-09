import type { Metadata } from "next";
import Link from "next/link";
import { Container, Section, Grid, Flex } from "@/components/layout/primitives";
import { ScrollReveal, ScrollRevealItem } from "@/components/motion/scroll-reveal";
import { PageHeader } from "@/components/sections/page-header";
import { ProductCard } from "@/components/sections/product-card";
import { getProducts } from "@/lib/data/products";
import { getActiveCategories } from "@/lib/data/dashboard";
import { siteConfig } from "@/config/site";
import { getCollectionPageSchema } from "@/lib/seo/json-ld";

export const metadata: Metadata = {
  title: "Shop All Products",
  description:
    "Browse the complete Nomad collection — GaN chargers, braided USB-C cables, 10K power banks & travel kits. Premium D2C electronics with 1-year replacement warranty. Free shipping over ₹1,999.",
  keywords: [
    "GaN charger India",
    "USB-C cable buy online",
    "power bank India",
    "travel charging kit",
    "D2C electronics",
    `${siteConfig.name} shop`,
  ],
  alternates: { canonical: `${siteConfig.url}/shop` },
  openGraph: {
    title: `Shop — ${siteConfig.name}`,
    description:
      "Browse the complete Nomad collection — GaN chargers, cables, power banks & travel kits.",
    url: `${siteConfig.url}/shop`,
    type: "website",
  },
};

export default async function ShopPage() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getActiveCategories(),
  ]);

  // CollectionPage + ItemList JSON-LD
  const collectionSchema = getCollectionPageSchema(products);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />

      <PageHeader
        eyebrow="Shop"
        title="Everything we make"
        description="Four essentials, built to be the last one you'll ever need to buy. No filler catalog."
      />

      <Section>
        <Container size="lg">
          {/* Category navigation pills — path-based for SEO */}
          <Flex gap="sm" wrap className="justify-center mb-10 border-b border-border/40 pb-6">
            <Link
              href="/shop"
              className="rounded-full px-5 py-2 text-sm font-semibold transition-all border bg-foreground text-background border-foreground shadow-sm"
            >
              All Products
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/shop/${cat.slug}`}
                className="rounded-full px-5 py-2 text-sm font-semibold transition-all border bg-transparent text-muted-foreground border-border/80 hover:text-foreground hover:border-foreground"
              >
                {cat.name}
              </Link>
            ))}
          </Flex>

          <ScrollReveal stagger>
            <Grid cols={4} gap="md">
              {products.map((product) => (
                <ScrollRevealItem key={product.id}>
                  <ProductCard product={product} />
                </ScrollRevealItem>
              ))}
            </Grid>
          </ScrollReveal>
        </Container>
      </Section>
    </>
  );
}
