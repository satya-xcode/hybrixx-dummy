import { Hero } from "@/components/sections/hero";
import { ProductGrid } from "@/components/sections/product-grid";
import { WhySection } from "@/components/sections/why-section";
import { Testimonials } from "@/components/sections/testimonials";
import { NewsletterCTA } from "@/components/sections/footer";
import { getProducts } from "@/lib/data/products";
import { getTestimonials } from "@/lib/data/testimonials";

export default async function Home() {
  const [products, testimonials] = await Promise.all([
    getProducts(),
    getTestimonials(),
  ]);

  return (
    <>
      <Hero />
      <ProductGrid products={products} />
      <WhySection />
      <Testimonials testimonials={testimonials} />
      <NewsletterCTA />
    </>
  );
}
