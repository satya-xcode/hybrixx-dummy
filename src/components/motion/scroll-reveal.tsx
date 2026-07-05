"use client";

import { motion, type Variants } from "motion/react";
import type { ReactNode } from "react";

/**
 * SCROLL REVEAL — the ONE place that defines how content animates into
 * view while scrolling. Every section on the site should wrap its content
 * in this instead of hand-rolling its own `motion.div` + variants, so a
 * single tweak here (duration, distance, stagger) updates the whole site.
 */

type Direction = "up" | "down" | "left" | "right" | "none";

const distance = 32;

const directionOffset: Record<Direction, { x?: number; y?: number }> = {
  up: { y: distance },
  down: { y: -distance },
  left: { x: distance },
  right: { x: -distance },
  none: {},
};

interface ScrollRevealProps {
  children: ReactNode;
  direction?: Direction;
  delay?: number;
  className?: string;
  /** Reveal every direct child in sequence instead of all at once */
  stagger?: boolean;
}

function buildVariants(direction: Direction, delay: number): Variants {
  return {
    hidden: { opacity: 0, ...directionOffset[direction] },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: 0.7,
        delay,
        ease: [0.16, 1, 0.3, 1], // --ease-liquid
      },
    },
  };
}

export function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  className,
  stagger = false,
}: ScrollRevealProps) {
  if (stagger) {
    return (
      <motion.div
        className={className}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        transition={{ staggerChildren: 0.12, delayChildren: delay }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={className}
      variants={buildVariants(direction, delay)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
    >
      {children}
    </motion.div>
  );
}

/** Use as a direct child of a `stagger` ScrollReveal parent */
export function ScrollRevealItem({
  children,
  direction = "up",
  className,
}: {
  children: ReactNode;
  direction?: Direction;
  className?: string;
}) {
  return (
    <motion.div className={className} variants={buildVariants(direction, 0)}>
      {children}
    </motion.div>
  );
}
