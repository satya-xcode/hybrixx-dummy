import type { Metadata } from "next";
import { Container, Section } from "@/components/layout/primitives";
import { PageHeader } from "@/components/sections/page-header";
import { FaqAccordion } from "@/components/sections/faq-accordion";
import { getFAQs } from "@/lib/data/faqs";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `FAQ — ${siteConfig.name}`,
  description: "Shipping, warranty, and returns — answered.",
};

export default async function FaqPage() {
  const faqs = await getFAQs();

  return (
    <>
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
