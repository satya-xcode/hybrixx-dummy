import Link from "next/link";
import { Container, Section, Stack, Flex } from "@/components/layout/primitives";
import { Heading, Text } from "@/components/ui/typography";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { siteConfig } from "@/config/site";
import { NewsletterForm } from "@/components/sections/newsletter-form";

export function NewsletterCTA() {
  return (
    <Section spacing="md">
      <Container size="md">
        <ScrollReveal>
          <div className="rounded-2xl border border-border bg-secondary px-8 py-12 text-center text-secondary-foreground">
            <Stack gap="sm" align="center">
              <Heading level="h2">Get 10% off your first order</Heading>
              <Text muted className="max-w-md opacity-80">
                Product drops and restock alerts. No spam, unsubscribe anytime.
              </Text>
              <NewsletterForm />
            </Stack>
          </div>
        </ScrollReveal>
      </Container>
    </Section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border py-10">
      <Container size="lg">
        <Flex justify="between" wrap gap="md">
          <Stack gap="xs">
            <Text variant="small" muted>
              © 2026 {siteConfig.name}. Demo storefront — not a real product.
            </Text>
            <Text variant="xs" muted>
              hello@nomad-gear.example
            </Text>
          </Stack>
          <Flex gap="md">
            {siteConfig.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </Flex>
        </Flex>
      </Container>
    </footer>
  );
}
