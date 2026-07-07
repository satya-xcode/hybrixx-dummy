import type { Metadata } from "next";
import { Container, Section } from "@/components/layout/primitives";
import { PageHeader } from "@/components/sections/page-header";
import { FaqAccordion } from "@/components/sections/faq-accordion";
import { getFAQs } from "@/lib/data/faqs";
import { siteConfig } from "@/config/site";
import { getFAQPageSchema } from "@/lib/seo/json-ld";

export const metadata: Metadata = {
  title: "FAQ — Shipping, Warranty & Returns",
  description:
    "Answers to common questions about Nomad products — shipping times, 1-year replacement warranty, returns policy, USB-C PD compatibility, and more.",
  alternates: { canonical: "/faq" },
  openGraph: {
    title: `FAQ — ${siteConfig.name}`,
    description:
      "Shipping, warranty, returns — every common question about Nomad products, answered.",
    url: `${siteConfig.url}/faq`,
    type: "website",
  },
};

export default async function FaqPage() {
  const faqs = await getFAQs();

  // FAQPage JSON-LD — Google shows these as rich results (expandable FAQ in SERPs!)
  const faqSchema = getFAQPageSchema(faqs);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <PageHeader
        eyebrow="Support"
        title="Frequently asked questions"
        description="Can't find what you need here? Reach out on the contact page and we'll get back within a day."
      />

      <Section>
        <Container size="md">
          <FaqAccordion items={faqs} />
        </Container>
      </Section>
    </>
  );
}
