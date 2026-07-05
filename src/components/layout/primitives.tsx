import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * LAYOUT PRIMITIVES — single source of truth for structural spacing.
 * Never hardcode max-width, section padding, or flex/gap values directly
 * in a page component. Compose these instead so a single change here
 * (e.g. tightening --space-2xl) propagates everywhere.
 */

type As = keyof React.JSX.IntrinsicElements;

/* ── Container: horizontal max-width + gutters ───────────────────────── */
interface ContainerProps extends React.ComponentProps<"div"> {
  as?: As;
  size?: "sm" | "md" | "lg" | "full";
}

const containerSizes: Record<NonNullable<ContainerProps["size"]>, string> = {
  sm: "max-w-3xl",
  md: "max-w-5xl",
  lg: "max-w-7xl",
  full: "max-w-none",
};

export function Container({
  as: Tag = "div",
  size = "lg",
  className,
  ...props
}: ContainerProps) {
  const Comp = Tag as React.ElementType;
  return (
    <Comp
      className={cn(
        "mx-auto w-full px-4 sm:px-6 lg:px-8",
        containerSizes[size],
        className
      )}
      {...props}
    />
  );
}

/* ── Section: vertical rhythm between page blocks ────────────────────── */
interface SectionProps extends React.ComponentProps<"section"> {
  spacing?: "sm" | "md" | "lg" | "xl" | "none";
}

const sectionSpacing: Record<NonNullable<SectionProps["spacing"]>, string> = {
  none: "",
  sm: "py-8 md:py-12",
  md: "py-12 md:py-20",
  lg: "py-16 md:py-28",
  xl: "py-20 md:py-36",
};

export function Section({
  spacing = "lg",
  className,
  ...props
}: SectionProps) {
  return (
    <section
      className={cn(sectionSpacing[spacing], className)}
      {...props}
    />
  );
}

/* ── Stack: vertical flex with a single gap token ────────────────────── */
interface StackProps extends React.ComponentProps<"div"> {
  as?: As;
  gap?: "xs" | "sm" | "md" | "lg" | "xl";
  align?: "start" | "center" | "end" | "stretch";
}

const gapMap: Record<NonNullable<StackProps["gap"]>, string> = {
  xs: "gap-2",
  sm: "gap-4",
  md: "gap-6",
  lg: "gap-10",
  xl: "gap-16",
};

const alignMap: Record<NonNullable<StackProps["align"]>, string> = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
};

export function Stack({
  as: Tag = "div",
  gap = "md",
  align = "stretch",
  className,
  ...props
}: StackProps) {
  const Comp = Tag as React.ElementType;
  return (
    <Comp
      className={cn("flex flex-col", gapMap[gap], alignMap[align], className)}
      {...props}
    />
  );
}

/* ── Flex: horizontal flex with gap + wrap + justify controls ────────── */
interface FlexProps extends React.ComponentProps<"div"> {
  as?: As;
  gap?: "xs" | "sm" | "md" | "lg" | "xl";
  align?: "start" | "center" | "end" | "stretch";
  justify?: "start" | "center" | "end" | "between" | "around";
  wrap?: boolean;
}

const justifyMap: Record<NonNullable<FlexProps["justify"]>, string> = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
  around: "justify-around",
};

export function Flex({
  as: Tag = "div",
  gap = "md",
  align = "center",
  justify = "start",
  wrap = false,
  className,
  ...props
}: FlexProps) {
  const Comp = Tag as React.ElementType;
  return (
    <Comp
      className={cn(
        "flex",
        gapMap[gap],
        alignMap[align],
        justifyMap[justify],
        wrap && "flex-wrap",
        className
      )}
      {...props}
    />
  );
}

/* ── Grid: responsive column grid with a single gap token ────────────── */
interface GridProps extends React.ComponentProps<"div"> {
  cols?: 1 | 2 | 3 | 4;
  gap?: "xs" | "sm" | "md" | "lg" | "xl";
}

const colsMap: Record<NonNullable<GridProps["cols"]>, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
};

export function Grid({
  cols = 3,
  gap = "md",
  className,
  ...props
}: GridProps) {
  return (
    <div
      className={cn("grid", colsMap[cols], gapMap[gap], className)}
      {...props}
    />
  );
}
