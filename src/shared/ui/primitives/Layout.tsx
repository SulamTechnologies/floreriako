import type { ElementType, HTMLAttributes, ReactNode } from "react";
import { cn } from "@/shared/lib/cn";

/* -------------------------------------------------------------------------- */
/* Container                                                                   */
/* -------------------------------------------------------------------------- */

type ContainerProps = HTMLAttributes<HTMLDivElement> & {
  /** `wide` para grids de producto, `prose` para texto legible largo */
  size?: "default" | "wide" | "narrow" | "prose";
  as?: ElementType;
};

const containerSizes = {
  narrow: "max-w-3xl",
  prose: "max-w-[68ch]",
  default: "max-w-7xl",
  wide: "max-w-[90rem]",
} as const;

export function Container({
  size = "default",
  as: Tag = "div",
  className,
  ...props
}: ContainerProps) {
  return (
    <Tag
      className={cn("mx-auto w-full px-5 sm:px-6 lg:px-8", containerSizes[size], className)}
      {...props}
    />
  );
}

/* -------------------------------------------------------------------------- */
/* Section                                                                     */
/* -------------------------------------------------------------------------- */

type SectionProps = HTMLAttributes<HTMLElement> & {
  /** Ritmo vertical consistente entre secciones del landing */
  spacing?: "none" | "sm" | "md" | "lg";
  tone?: "default" | "raised" | "sunken" | "brand" | "inverse";
};

const sectionSpacing = {
  none: "",
  sm: "py-12 sm:py-16",
  md: "py-16 sm:py-20 lg:py-24",
  lg: "py-20 sm:py-28 lg:py-36",
} as const;

const sectionTones = {
  default: "",
  raised: "bg-surface-raised",
  sunken: "bg-surface-sunken",
  brand: "bg-brand-50",
  inverse: "bg-surface-inverse text-ink-inverse",
} as const;

export function Section({ spacing = "md", tone = "default", className, ...props }: SectionProps) {
  return (
    <section
      className={cn("relative", sectionSpacing[spacing], sectionTones[tone], className)}
      {...props}
    />
  );
}

/* -------------------------------------------------------------------------- */
/* SectionHeading                                                              */
/* -------------------------------------------------------------------------- */

type SectionHeadingProps = {
  /** Texto pequeño sobre el título, orienta al usuario en la página */
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  /** Nivel semántico. La landing solo debe tener un `h1`. */
  as?: "h1" | "h2" | "h3";
  className?: string;
  children?: ReactNode;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  as: Tag = "h2",
  className,
  children,
}: SectionHeadingProps) {
  const centered = align === "center";
  return (
    <div className={cn("flex flex-col gap-3", centered && "items-center text-center", className)}>
      {eyebrow ? (
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-brand">
          {eyebrow}
        </span>
      ) : null}
      <Tag className="font-display text-display-sm font-semibold text-balance text-ink">
        {title}
      </Tag>
      {description ? (
        <p
          className={cn(
            "text-base leading-relaxed text-ink-muted text-pretty",
            centered ? "max-w-2xl" : "max-w-xl",
          )}
        >
          {description}
        </p>
      ) : null}
      {children}
    </div>
  );
}
