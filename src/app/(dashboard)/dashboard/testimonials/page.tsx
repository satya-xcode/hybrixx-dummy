import { getAllTestimonials } from "@/lib/data/dashboard";
import { TestimonialsManager } from "@/components/sections/testimonials-manager";

export default async function TestimonialsPage() {
  const testimonials = await getAllTestimonials();

  return <TestimonialsManager testimonials={testimonials} />;
}
