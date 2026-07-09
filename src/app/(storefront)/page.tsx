import type { Metadata } from "next";
import { Hero } from "@/components/sections/hero";
import { ProductGrid } from "@/components/sections/product-grid";
import { WhySection } from "@/components/sections/why-section";
import { Testimonials } from "@/components/sections/testimonials";
import { NewsletterCTA } from "@/components/sections/footer";
import { getProducts } from "@/lib/data/products";
import { getTestimonials } from "@/lib/data/testimonials";
import { siteConfig } from "@/config/site";
import { getItemListSchema, getWebPageSchema } from "@/lib/seo/json-ld";

/**
 * Home page metadata — overrides the layout template for the root URL.
 * This is the most important page for SEO: the canonical homepage.
 */
export const metadata: Metadata = {
  title: `${siteConfig.name} — ${siteConfig.tagline}`,
  description:
    "Shop GaN chargers, braided USB-C cables, power banks & travel kits from Nomad. Premium D2C electronics built to be the last you buy. Free shipping over ₹1,999.",
  alternates: { canonical: "/" },
  openGraph: {
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description:
      "Shop GaN chargers, braided USB-C cables, power banks & travel kits from Nomad. Premium D2C electronics built to be the last you buy.",
    url: siteConfig.url,
    type: "website",
  },
};

export default async function Home() {
  const [products, testimonials] = await Promise.all([
    getProducts(),
    getTestimonials(),
  ]);

  // Home page JSON-LD: WebPage + ItemList (product carousel in SERPs)
  const webPageSchema = getWebPageSchema();
  const itemListSchema = getItemListSchema(products);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([webPageSchema, itemListSchema]),
        }}
      />
      <Hero />
      <ProductGrid products={products} />
      <WhySection />
      <Testimonials testimonials={testimonials} />
      <NewsletterCTA />
    </>
  );
}
