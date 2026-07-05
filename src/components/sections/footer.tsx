import Link from "next/link";
import { Container, Section, Stack, Flex } from "@/components/layout/primitives";
import { Heading, Text } from "@/components/ui/typography";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { Button } from "@/components/ui/button";
import { siteConfig, contactInfo } from "@/config/site";

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
              <Flex gap="sm" className="mt-4 w-full max-w-sm" wrap>
                <input
                  type="email"
                  placeholder="you@email.com"
                  className="h-11 flex-1 rounded-xl border border-secondary-foreground/20 bg-secondary-foreground/10 px-4 text-sm text-secondary-foreground outline-none placeholder:text-secondary-foreground/50 focus-visible:ring-2 focus-visible:ring-primary"
                />
                <Button>Subscribe</Button>
              </Flex>
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
              © {new Date().getFullYear()} {siteConfig.name}. Demo storefront — not a real product.
            </Text>
            <Text variant="xs" muted>
              {contactInfo.email}
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
