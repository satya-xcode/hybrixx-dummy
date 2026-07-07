import type { Metadata } from "next";
import { Container, Section, Grid } from "@/components/layout/primitives";
import { ScrollReveal, ScrollRevealItem } from "@/components/motion/scroll-reveal";
import { PageHeader } from "@/components/sections/page-header";
import { ProductCard } from "@/components/sections/product-card";
import { getProducts } from "@/lib/data/products";
import { siteConfig } from "@/config/site";
import { getCollectionPageSchema } from "@/lib/seo/json-ld";

export const metadata: Metadata = {
  title: "Shop All Products",
  description:
    "Browse the complete Nomad collection — GaN chargers, braided USB-C cables, 10K power banks & travel kits. Premium D2C electronics with 1-year replacement warranty. Free shipping over ₹1,999.",
  alternates: { canonical: "/shop" },
  openGraph: {
    title: `Shop — ${siteConfig.name}`,
    description:
      "Browse the complete Nomad collection — GaN chargers, cables, power banks & travel kits.",
    url: `${siteConfig.url}/shop`,
    type: "website",
  },
};

export default async function ShopPage() {
  const products = await getProducts();

  // CollectionPage + ItemList JSON-LD for product carousel in SERPs
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
