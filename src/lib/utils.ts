import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind class names safely, resolving conflicts (e.g. p-2 vs p-4)
 * in favor of the last one. Use this instead of template-string className
 * concatenation anywhere conditional classes are involved.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
