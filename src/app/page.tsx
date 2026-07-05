import { Hero } from "@/components/sections/hero";
import { ProductGrid } from "@/components/sections/product-grid";
import { WhySection } from "@/components/sections/why-section";
import { Testimonials } from "@/components/sections/testimonials";
import { NewsletterCTA } from "@/components/sections/footer";

export default function Home() {
  return (
    <>
      <Hero />
      <ProductGrid />
      <WhySection />
      <Testimonials />
      <NewsletterCTA />
    </>
  );
}
