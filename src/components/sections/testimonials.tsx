import { Container, Section, Stack, Grid } from "@/components/layout/primitives";
import { Heading, Text } from "@/components/ui/typography";
import { ScrollReveal, ScrollRevealItem } from "@/components/motion/scroll-reveal";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import type { Testimonial } from "@/lib/types";

export function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  return (
    <Section id="reviews">
      <Container size="lg">
        <Stack gap="xl">
          <ScrollReveal className="max-w-xl">
            <Heading level="h1">Loved by 500+ customers</Heading>
          </ScrollReveal>

          <ScrollReveal stagger>
            <Grid cols={3} gap="md">
              {testimonials.map((t) => (
                <ScrollRevealItem key={t.id}>
                  <Card className="h-full">
                    <CardContent className="flex flex-col gap-3">
                      <div className="flex gap-0.5">
                        {Array.from({ length: t.rating }).map((_, i) => (
                          <Star
                            key={i}
                            className="size-4 fill-warning text-warning"
                          />
                        ))}
                      </div>
                      <Text variant="body">&ldquo;{t.quote}&rdquo;</Text>
                      <Text variant="small" muted>
                        {t.name} · {t.role}
                      </Text>
                    </CardContent>
                  </Card>
                </ScrollRevealItem>
              ))}
            </Grid>
          </ScrollReveal>
        </Stack>
      </Container>
    </Section>
  );
}
