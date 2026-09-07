import logoUrl from "@/assets/brand/logo.svg";
import { business } from "@/config/business";
import { cn } from "@/shared/lib/cn";

/**
 * Logo de la marca.
 *
 * El sello lleva el nombre grabado en circular, pero a 40 px ese texto no se
 * lee: por eso el lockup repite el nombre en tipografía a un lado. En `mark`
 * (móvil, espacios chicos) va solo el sello.
 *
 * El archivo es un SVG trazado a partir del PNG que entregó el negocio, así
 * que escala sin pixelarse. Sigue pendiente el original del diseñador: el
 * trazado engrosa un poco las líneas más finas del ramo.
 *
 * El sello es tinta negra, así que en fondos oscuros se invierte por filtro en
 * vez de mantener un segundo archivo.
 */

type LogoProps = {
  /** `full` = sello + nombre, `mark` = solo el sello */
  variant?: "full" | "mark";
  /** `inverse` para fondos oscuros */
  tone?: "default" | "inverse";
  className?: string;
};

export function LogoMark({
  tone = "default",
  className,
}: {
  tone?: "default" | "inverse";
  className?: string;
}) {
  return (
    <img
      src={logoUrl}
      alt=""
      width={128}
      height={130}
      // Decorativo: el nombre accesible lo da el `aria-label` del enlace
      aria-hidden="true"
      className={cn("h-10 w-auto shrink-0", tone === "inverse" && "invert", className)}
    />
  );
}

export function Logo({ variant = "full", tone = "default", className }: LogoProps) {
  const inverse = tone === "inverse";

  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark tone={tone} />
      {variant === "full" ? (
        <span className="flex flex-col leading-none">
          <span
            className={cn(
              "font-display text-[1.0625rem] font-semibold uppercase tracking-[0.16em]",
              inverse ? "text-white" : "text-ink",
            )}
          >
            {business.name}
          </span>
          <span
            className={cn(
              "mt-1 text-[0.5rem] font-semibold uppercase tracking-[0.28em]",
              inverse ? "text-brand-200/80" : "text-ink-muted",
            )}
          >
            {business.tagline}
          </span>
        </span>
      ) : null}
    </span>
  );
}
