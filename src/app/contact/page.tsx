import type { Metadata } from "next";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { Container, Section, Stack, Grid, Flex } from "@/components/layout/primitives";
import { Heading, Text } from "@/components/ui/typography";
import { Card } from "@/components/ui/card";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { PageHeader } from "@/components/sections/page-header";
import { ContactForm } from "@/components/sections/contact-form";
import { getContactInfo } from "@/lib/data/site-settings";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `Contact — ${siteConfig.name}`,
  description: "Get in touch with the Nomad team.",
};

const iconMap = {
  Email: Mail,
  Phone: Phone,
  Address: MapPin,
  Hours: Clock,
} as const;

export default async function ContactPage() {
  const contactInfo = await getContactInfo();

  const infoRows = [
    { icon: iconMap.Email, label: "Email", value: contactInfo.email },
    { icon: iconMap.Phone, label: "Phone", value: contactInfo.phone },
    { icon: iconMap.Address, label: "Address", value: contactInfo.address },
    { icon: iconMap.Hours, label: "Hours", value: contactInfo.hours },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Get in touch"
        description="Order issue, warranty claim, or just a question — this reaches the actual team, not a ticket queue."
      />

      <Section>
        <Container size="lg">
          <Grid cols={2} gap="lg">
            <ScrollReveal direction="left">
              <Stack gap="md">
                {infoRows.map((row) => (
                  <Card key={row.label} className="flex-row items-start gap-4">
                    <row.icon className="mt-0.5 size-5 shrink-0 text-primary" />
                    <Stack gap="xs">
                      <Text variant="small" muted>
                        {row.label}
                      </Text>
                      <Text className="font-medium">{row.value}</Text>
                    </Stack>
                  </Card>
                ))}
              </Stack>
            </ScrollReveal>

            <ScrollReveal direction="right">
              <Card>
                <Flex justify="between" className="mb-2">
                  <Heading level="h3">Send a message</Heading>
                </Flex>
                <ContactForm />
              </Card>
            </ScrollReveal>
          </Grid>
        </Container>
      </Section>
    </>
  );
}
