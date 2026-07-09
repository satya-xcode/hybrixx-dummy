import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Container, Section, Grid, Flex } from "@/components/layout/primitives";
import { ScrollReveal, ScrollRevealItem } from "@/components/motion/scroll-reveal";
import { PageHeader } from "@/components/sections/page-header";
import { ProductCard } from "@/components/sections/product-card";
import { getProducts } from "@/lib/data/products";
import { getActiveCategories } from "@/lib/data/dashboard";
import { siteConfig } from "@/config/site";
import { getCollectionPageSchema } from "@/lib/seo/json-ld";
import { cn } from "@/lib/utils";

interface ShopPageProps {
  searchParams: Promise<{ category?: string }>;
}

export async function generateMetadata({ searchParams }: ShopPageProps): Promise<Metadata> {
  const { category: activeCategory } = await searchParams;

  if (activeCategory) {
    const categories = await getActiveCategories();
    const catObj = categories.find((c) => c.slug === activeCategory);
    const catName = catObj
      ? catObj.name
      : activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1);

    return {
      title: `Shop ${catName}`,
      description: `Browse our collection of high-performance Nomad ${catName.toLowerCase()}. Premium D2C electronics with 1-year replacement warranty. Free shipping over ₹1,999.`,
      keywords: [
        catName,
        `buy ${catName.toLowerCase()} online India`,
        `${siteConfig.name} ${catName.toLowerCase()}`,
        "D2C electronics",
        "premium electronics India",
      ],
      alternates: { canonical: `${siteConfig.url}/shop?category=${activeCategory}` },
      openGraph: {
        title: `Shop ${catName} — ${siteConfig.name}`,
        description: `Browse our collection of high-performance Nomad ${catName.toLowerCase()}.`,
        url: `${siteConfig.url}/shop?category=${activeCategory}`,
        type: "website",
      },
    };
  }

  return {
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
}

// Root Page Shell
export default function ShopPage({ searchParams }: ShopPageProps) {
  return (
    <>
      <PageHeader
        eyebrow="Shop"
        title="Everything we make"
        description="Four essentials, built to be the last one you'll ever need to buy. No filler catalog."
      />

      <Section>
        <Container size="lg">
          {/* Suspense boundary for partial pre-rendering (PPR) of dynamic filter content */}
          <Suspense fallback={<div className="py-20 text-center text-muted-foreground">Loading products catalog...</div>}>
            <ShopContent searchParams={searchParams} />
          </Suspense>
        </Container>
      </Section>
    </>
  );
}

// Dynamic Component wrapping searchParams access
async function ShopContent({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category: activeCategory } = await searchParams;

  const [products, categories] = await Promise.all([
    getProducts(),
    getActiveCategories(),
  ]);

  const filteredProducts = activeCategory
    ? products.filter((p) => p.category === activeCategory)
    : products;

  // Resolve category display name for schema
  const activeCatObj = activeCategory
    ? categories.find((c) => c.slug === activeCategory)
    : null;

  // CollectionPage + ItemList JSON-LD — category-aware for richer SERPs
  const collectionSchema = getCollectionPageSchema(filteredProducts, {
    categoryName: activeCatObj?.name,
    categorySlug: activeCategory,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />

      {/* Category Filter Pills (SEO-friendly URL links) */}
      <Flex gap="sm" wrap className="justify-center mb-10 border-b border-border/40 pb-6">
        <Link
          href="/shop"
          className={cn(
            "rounded-full px-5 py-2 text-sm font-semibold transition-all border",
            !activeCategory
              ? "bg-foreground text-background border-foreground shadow-sm"
              : "bg-transparent text-muted-foreground border-border/80 hover:text-foreground hover:border-foreground"
          )}
        >
          All Products
        </Link>
        {categories.map((cat) => {
          const isActive = activeCategory === cat.slug;
          return (
            <Link
              key={cat.id}
              href={`/shop?category=${cat.slug}`}
              className={cn(
                "rounded-full px-5 py-2 text-sm font-semibold transition-all border",
                isActive
                  ? "bg-foreground text-background border-foreground shadow-sm"
                  : "bg-transparent text-muted-foreground border-border/80 hover:text-foreground hover:border-foreground"
              )}
            >
              {cat.name}
            </Link>
          );
        })}
      </Flex>

      {filteredProducts.length === 0 ? (
        <div className="py-20 text-center text-muted-foreground">
          No products found in this category.
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
    </>
  );
}
