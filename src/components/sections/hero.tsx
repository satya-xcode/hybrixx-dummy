"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Container, Section, Stack, Flex } from "@/components/layout/primitives";
import { Heading, Text } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { siteConfig } from "@/config/site";
import { ArrowRight, Star } from "lucide-react";

const easeLiquid = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  return (
    <Section spacing="xl" className="relative overflow-hidden">
      {/* Ambient brand glow — decorative only */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 right-0 h-96 w-96 rounded-full opacity-20 blur-[100px]"
        style={{ background: "var(--primary)" }}
      />

      <Container size="lg">
        <Stack gap="lg" align="center" className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: easeLiquid }}
          >
            <Badge variant="outline" className="mb-2">
              <Star className="size-3 fill-warning text-warning" />
              4.8 average rating from 500+ orders
            </Badge>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: easeLiquid }}
          >
            <Heading level="hero" className="max-w-3xl">
              {siteConfig.tagline}
            </Heading>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: easeLiquid }}
          >
            <Text variant="lead" muted className="max-w-xl">
              {siteConfig.description}
            </Text>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: easeLiquid }}
          >
            <Flex gap="sm" justify="center" wrap>
              <Button size="lg" asChild>
                <Link href="/shop">
                  Shop the collection
                  <ArrowRight />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/about">Why Nomad</Link>
              </Button>
            </Flex>
          </motion.div>
        </Stack>
      </Container>
    </Section>
  );
}
