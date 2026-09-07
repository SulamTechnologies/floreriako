import type { HTMLAttributes } from "react";
import { cn } from "@/shared/lib/cn";

export type BadgeTone = "brand" | "accent" | "neutral" | "inverse" | "outline";

const tones: Record<BadgeTone, string> = {
  brand: "bg-brand-50 text-brand-700 border-brand-200",
  accent: "bg-accent-50 text-accent-700 border-accent-200",
  neutral: "bg-surface-sunken text-ink-soft border-line",
  inverse: "bg-white/10 text-white border-white/20 backdrop-blur-sm",
  outline: "bg-transparent text-ink-soft border-line-strong",
};

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: BadgeTone;
};

export function Badge({ tone = "brand", className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-pill border px-3 py-1 text-xs font-semibold",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
