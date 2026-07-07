import type { Metadata } from "next";
import Link from "next/link";
import { Container, Section, Stack, Grid, Flex } from "@/components/layout/primitives";
import { Heading, Text } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollReveal, ScrollRevealItem } from "@/components/motion/scroll-reveal";
import { PageHeader } from "@/components/sections/page-header";
import { WhySection } from "@/components/sections/why-section";
import { getAboutStats } from "@/lib/data/site-settings";
import { siteConfig } from "@/config/site";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: `About — ${siteConfig.name}`,
  description: "Why Nomad exists, and what we're building toward.",
};

export default async function AboutPage() {
  const aboutStats = await getAboutStats();

  return (
    <>
      <PageHeader
        eyebrow="Our story"
        title="Gear that respects your time"
        description="Nomad started with one annoyance: buying a charger that looked premium and died in six months. Everything we make since has been built to be the last one you buy."
      />

      <Section>
        <Container size="lg">
          <Grid cols={2} gap="lg">
            <ScrollReveal direction="left">
              <Stack gap="md">
                <Heading level="h2">Small catalog, on purpose</Heading>
                <Text variant="body" muted>
                  Most D2C electronics brands chase catalog size — twenty
                  chargers, forty cable colors, a power bank for every budget.
                  We went the other way. Four products, each one the version
                  we&apos;d actually want to own, rebuilt until there was
                  nothing left to cut.
                </Text>
                <Text variant="body" muted>
                  That means no A/B testing which cheap capacitor slips past
                  QA this quarter. Every unit that ships is the same one we
                  tested, because it&apos;s the only one we sell.
                </Text>
              </Stack>
            </ScrollReveal>

            <ScrollReveal stagger>
              <Grid cols={2} gap="sm">
                {aboutStats.map((stat) => (
                  <ScrollRevealItem key={stat.label}>
                    <Card className="items-center text-center">
                      <Text className="text-h2 font-bold text-primary">
                        {stat.value}
                      </Text>
                      <Text variant="small" muted>
                        {stat.label}
                      </Text>
                    </Card>
                  </ScrollRevealItem>
                ))}
              </Grid>
            </ScrollReveal>
          </Grid>
        </Container>
      </Section>

      <WhySection />

      <Section spacing="md">
        <Container size="md">
          <ScrollReveal>
            <Stack gap="sm" align="center" className="text-center">
              <Heading level="h2">Ready to upgrade your carry?</Heading>
              <Text variant="lead" muted className="max-w-md">
                Four products. Pick the one that fixes what&apos;s annoying
                you right now.
              </Text>
              <Flex justify="center" className="mt-2">
                <Button size="lg" asChild>
                  <Link href="/shop">
                    Shop the collection
                    <ArrowRight />
                  </Link>
                </Button>
              </Flex>
            </Stack>
          </ScrollReveal>
        </Container>
      </Section>
    </>
  );
}
