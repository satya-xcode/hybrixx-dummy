import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container, Section, Grid, Flex } from "@/components/layout/primitives";
import { ScrollReveal, ScrollRevealItem } from "@/components/motion/scroll-reveal";
import { PageHeader } from "@/components/sections/page-header";
import { ProductCard } from "@/components/sections/product-card";
import { getProducts } from "@/lib/data/products";
import { getActiveCategories } from "@/lib/data/dashboard";
import { siteConfig } from "@/config/site";
import { getCollectionPageSchema } from "@/lib/seo/json-ld";
import { cn } from "@/lib/utils";

type CategoryPageProps = {
  params: Promise<{ category: string }>;
};

export async function generateStaticParams() {
  const categories = await getActiveCategories();
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const categories = await getActiveCategories();
  const catObj = categories.find((c) => c.slug === categorySlug);

  if (!catObj) return {};

  return {
    title: `Shop ${catObj.name}`,
    description: `Browse our collection of high-performance Nomad ${catObj.name.toLowerCase()}. ${catObj.description || "Premium D2C electronics"} with 1-year replacement warranty. Free shipping over ₹1,999.`,
    keywords: [
      catObj.name,
      `buy ${catObj.name.toLowerCase()} online India`,
      `${siteConfig.name} ${catObj.name.toLowerCase()}`,
      "D2C electronics",
      "premium electronics India",
    ],
    alternates: { canonical: `${siteConfig.url}/shop/${categorySlug}` },
    openGraph: {
      title: `Shop ${catObj.name} — ${siteConfig.name}`,
      description: `Browse our collection of high-performance Nomad ${catObj.name.toLowerCase()}.`,
      url: `${siteConfig.url}/shop/${categorySlug}`,
      type: "website",
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: categorySlug } = await params;

  const [products, categories] = await Promise.all([
    getProducts(),
    getActiveCategories(),
  ]);

  const catObj = categories.find((c) => c.slug === categorySlug);
  if (!catObj) notFound();

  const filteredProducts = products.filter((p) => p.category === categorySlug);

  // CollectionPage JSON-LD — category-specific
  const collectionSchema = getCollectionPageSchema(filteredProducts, {
    categoryName: catObj.name,
    categorySlug: categorySlug,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />

      <PageHeader
        eyebrow="Shop"
        title={catObj.name}
        description={catObj.description || `Browse all ${catObj.name.toLowerCase()} from ${siteConfig.name}.`}
      />

      <Section>
        <Container size="lg">
          {/* Category navigation pills */}
          <Flex gap="sm" wrap className="justify-center mb-10 border-b border-border/40 pb-6">
            <Link
              href="/shop"
              className="rounded-full px-5 py-2 text-sm font-semibold transition-all border bg-transparent text-muted-foreground border-border/80 hover:text-foreground hover:border-foreground"
            >
              All Products
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/shop/${cat.slug}`}
                className={cn(
                  "rounded-full px-5 py-2 text-sm font-semibold transition-all border",
                  cat.slug === categorySlug
                    ? "bg-foreground text-background border-foreground shadow-sm"
                    : "bg-transparent text-muted-foreground border-border/80 hover:text-foreground hover:border-foreground"
                )}
              >
                {cat.name}
              </Link>
            ))}
          </Flex>

          {filteredProducts.length === 0 ? (
            <div className="py-20 text-center text-muted-foreground">
              No products found in this category yet.
            </div>
          ) : (
            <ScrollReveal stagger>
              <Grid cols={4} gap="md">
                {filteredProducts.map((product) => (
                  <ScrollRevealItem key={product.id}>
                    <ProductCard product={product} />
                  </ScrollRevealItem>
                ))}
              </Grid>
            </ScrollReveal>
          )}
        </Container>
      </Section>
    </>
  );
}
