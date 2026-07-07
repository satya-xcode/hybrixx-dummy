import Link from "next/link";
import { Container, Section, Stack, Grid, Flex } from "@/components/layout/primitives";
import { Heading, Text } from "@/components/ui/typography";
import { ScrollReveal, ScrollRevealItem } from "@/components/motion/scroll-reveal";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/sections/product-card";
import { ArrowRight } from "lucide-react";
import type { Product } from "@/lib/types";

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <Section id="products">
      <Container size="lg">
        <Stack gap="xl">
          <ScrollReveal className="max-w-xl">
            <Heading level="h1">Built for daily carry</Heading>
            <Text variant="lead" muted className="mt-3">
              Four essentials. No filler catalog, no decision fatigue.
            </Text>
          </ScrollReveal>

          <ScrollReveal stagger>
            <Grid cols={4} gap="md">
              {products.map((product) => (
                <ScrollRevealItem key={product.id}>
                  <ProductCard product={product} />
                </ScrollRevealItem>
              ))}
            </Grid>
          </ScrollReveal>

          <ScrollReveal>
            <Flex justify="center">
              <Button variant="outline" asChild>
                <Link href="/shop">
                  View all products
                  <ArrowRight />
                </Link>
              </Button>
            </Flex>
          </ScrollReveal>
        </Stack>
      </Container>
    </Section>
  );
}
