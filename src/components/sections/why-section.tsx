import { Container, Section, Stack, Grid } from "@/components/layout/primitives";
import { Heading, Text } from "@/components/ui/typography";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Zap, ShieldCheck, Truck } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "GaN-fast charging",
    body: "Smaller, cooler, and faster than silicon chargers twice the size.",
  },
  {
    icon: ShieldCheck,
    title: "1-year replacement",
    body: "No questions asked. If it stops charging, we send a new one.",
  },
  {
    icon: Truck,
    title: "2-day dispatch",
    body: "Ordered before 2pm ships same day from our Noida warehouse.",
  },
];

export function WhySection() {
  return (
    <Section id="why" className="bg-muted/40">
      <Container size="lg">
        <Stack gap="xl">
          <ScrollReveal className="max-w-xl">
            <Heading level="h1">Why people switch to Nomad</Heading>
          </ScrollReveal>

          <Grid cols={3} gap="md">
            {features.map((feature, i) => (
              <ScrollReveal
                key={feature.title}
                direction={i % 2 === 0 ? "left" : "right"}
                delay={i * 0.08}
              >
                <Card className="h-full">
                  <CardContent className="flex flex-col gap-3">
                    <feature.icon className="size-6 text-primary" />
                    <CardTitle>{feature.title}</CardTitle>
                    <Text variant="small" muted>
                      {feature.body}
                    </Text>
                  </CardContent>
                </Card>
              </ScrollReveal>
            ))}
          </Grid>
        </Stack>
      </Container>
    </Section>
  );
}
