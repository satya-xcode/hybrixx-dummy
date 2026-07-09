import { getNewsletterSubscribers } from "@/lib/data/dashboard";
import { NewsletterManager } from "@/components/sections/newsletter-manager";

export default async function NewsletterPage() {
  const subscribers = await getNewsletterSubscribers();

  return <NewsletterManager subscribers={subscribers} />;
}
