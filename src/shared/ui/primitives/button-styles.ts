import { cn } from "@/shared/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "outline" | "inverse" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-semibold whitespace-nowrap rounded-pill " +
  "transition-[transform,box-shadow,background-color,color,border-color] duration-200 ease-brand " +
  "disabled:opacity-50 disabled:pointer-events-none select-none";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-700 text-white hover:bg-brand-800 hover:shadow-brand hover:-translate-y-0.5 active:translate-y-0",
  secondary:
    "bg-surface-raised text-ink border border-line-strong hover:border-brand-300 hover:text-ink-brand hover:shadow-soft",
  outline: "border border-brand-700 text-ink-brand hover:bg-brand-50 hover:border-brand-800",
  ghost: "text-ink-soft hover:text-ink-brand hover:bg-brand-50",
  inverse: "bg-white text-brand-800 hover:bg-brand-50 hover:-translate-y-0.5 active:translate-y-0",
  danger: "bg-danger-600 text-white hover:bg-danger-700",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-sm",
  lg: "h-13 px-8 text-base",
};

/**
 * Clases del botón sin el elemento. Úsalo para dar apariencia de botón a un
 * `<Link>` de react-router o a un `<a>`, sin romper la semántica.
 */
export function buttonStyles(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  className?: string,
) {
  return cn(base, variants[variant], sizes[size], className);
}
