import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * TYPOGRAPHY — maps a semantic "level" to a fluid clamp()-based size token
 * defined once in globals.css (--text-hero, --text-h1, ...). Pages should
 * never write text-4xl/text-6xl ad-hoc; they pick a level here so resizing
 * the whole site's type scale is a one-file change.
 */

type HeadingLevel = "hero" | "h1" | "h2" | "h3";

const headingClass: Record<HeadingLevel, string> = {
  hero: "text-hero font-bold",
  h1: "text-h1 font-bold",
  h2: "text-h2 font-semibold",
  h3: "text-h3 font-semibold",
};

const defaultTag: Record<HeadingLevel, keyof React.JSX.IntrinsicElements> = {
  hero: "h1",
  h1: "h1",
  h2: "h2",
  h3: "h3",
};

interface HeadingProps extends React.ComponentProps<"h1"> {
  level?: HeadingLevel;
  as?: keyof React.JSX.IntrinsicElements;
}

export function Heading({
  level = "h2",
  as,
  className,
  ...props
}: HeadingProps) {
  const Tag = (as ?? defaultTag[level]) as React.ElementType;
  return (
    <Tag className={cn(headingClass[level], className)} {...props} />
  );
}

interface TextProps extends React.ComponentProps<"p"> {
  variant?: "lead" | "body" | "small" | "xs";
  muted?: boolean;
}

const textClass: Record<NonNullable<TextProps["variant"]>, string> = {
  lead: "text-lead",
  body: "text-base",
  small: "text-sm",
  xs: "text-xs",
};

export function Text({
  variant = "body",
  muted = false,
  className,
  ...props
}: TextProps) {
  return (
    <p
      className={cn(
        textClass[variant],
        muted && "text-muted-foreground",
        className
      )}
      {...props}
    />
  );
}
