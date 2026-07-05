import type { Metadata } from "next";
import { Container, Section, Grid } from "@/components/layout/primitives";
import { ScrollReveal, ScrollRevealItem } from "@/components/motion/scroll-reveal";
import { PageHeader } from "@/components/sections/page-header";
import { ProductCard } from "@/components/sections/product-card";
import { products, siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `Shop — ${siteConfig.name}`,
  description: "Every product Nomad makes, on one page.",
};

export default function ShopPage() {
  return (
    <>
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
