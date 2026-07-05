import { Container, Section, Stack } from "@/components/layout/primitives";
import { Heading, Text } from "@/components/ui/typography";
import { ScrollReveal } from "@/components/motion/scroll-reveal";

/**
 * PAGE HEADER — the ONE banner every non-home page opens with (Shop, About,
 * FAQ, Contact). Keeps every page's top-of-page rhythm and type scale
 * identical instead of each page rolling its own hero. Homepage keeps its
 * own <Hero> since it's a marketing landing, not a utility page.
 */
interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
}

export function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <Section spacing="md" className="border-b border-border bg-muted/40">
      <Container size="lg">
        <ScrollReveal>
          <Stack gap="sm" className="max-w-2xl">
            {eyebrow && (
              <Text
                variant="small"
                className="font-semibold uppercase tracking-wide text-primary"
              >
                {eyebrow}
              </Text>
            )}
            <Heading level="h1">{title}</Heading>
            {description && (
              <Text variant="lead" muted>
                {description}
              </Text>
            )}
          </Stack>
        </ScrollReveal>
      </Container>
    </Section>
  );
}
