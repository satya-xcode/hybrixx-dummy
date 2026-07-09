import * as React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.ComponentProps<"input"> {}

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "flex h-11 w-full rounded-xl border border-border bg-surface px-4 py-2 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

interface TextareaProps extends React.ComponentProps<"textarea"> {}

export function Textarea({ className, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(
        "flex min-h-[96px] w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

interface SelectProps extends React.ComponentProps<"select"> {
  children: React.ReactNode;
}

export function Select({ className, children, ...props }: SelectProps) {
  return (
    <select
      className={cn(
        "flex h-11 w-full rounded-xl border border-border bg-surface px-4 py-2 text-sm text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}

interface FormFieldProps {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  error?: string;
  className?: string;
}

export function FormField({
  label,
  required,
  children,
  error,
  className,
}: FormFieldProps) {
  return (
    <div className={cn("space-y-1.5 w-full", className)}>
      <label className="text-sm font-semibold text-foreground">
        {label}
        {required && <span className="ml-1 text-primary">*</span>}
      </label>
      {children}
      {error && (
        <span className="text-xs font-semibold text-destructive">{error}</span>
      )}
    </div>
  );
}
