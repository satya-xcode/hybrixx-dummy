import { getAllFAQs } from "@/lib/data/dashboard";
import { FaqsManager } from "@/components/sections/faqs-manager";

export default async function FaqsPage() {
  const faqs = await getAllFAQs();

  return <FaqsManager faqs={faqs} />;
}
