import type { ImgHTMLAttributes } from "react";
import type { Photo } from "@/assets/photos";
import { cn } from "@/shared/lib/cn";

/**
 * Contenedor de imagen con proporción reservada.
 *
 * Mientras no existan las fotos reales, pinta un placeholder decorativo con la
 * MISMA proporción que tendrá la foto final. Así el layout no se mueve cuando
 * se intercambien los assets, y no hay CLS.
 *
 * Uso con foto real:      <Media src={ramoPrimavera} alt="Ramo de primavera" ratio="4/5" />
 * Uso con placeholder:    <Media alt="" ratio="4/5" seed={2} />
 */

export type MediaRatio = "1/1" | "4/5" | "3/4" | "4/3" | "3/2" | "16/9" | "21/9";

const ratios: Record<MediaRatio, string> = {
  "1/1": "aspect-square",
  "4/5": "aspect-[4/5]",
  "3/4": "aspect-[3/4]",
  "4/3": "aspect-[4/3]",
  "3/2": "aspect-[3/2]",
  "16/9": "aspect-video",
  "21/9": "aspect-[21/9]",
};

type PlaceholderTheme = { from: string; to: string; petal: string; core: string };

/** Combinaciones de placeholder, deterministas por `seed`, nunca aleatorias */
const placeholderThemes: [PlaceholderTheme, ...PlaceholderTheme[]] = [
  { from: "#ffe7ed", to: "#f8f2f0", petal: "#f3a7bf", core: "#9e2750" },
  { from: "#f8f2f0", to: "#fdfaf9", petal: "#ded1cc", core: "#6d5f5a" },
  { from: "#e6e9d9", to: "#f8f2f0", petal: "#b0b98d", core: "#4a5131" },
  { from: "#fff5f7", to: "#fdfaf9", petal: "#fbcedb", core: "#bf3663" },
  { from: "#f9eecd", to: "#fdfaf9", petal: "#e3c66d", core: "#96741f" },
];

type MediaProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "alt" | "srcSet"> & {
  /** Foto de la marca: aporta `src` y `srcSet` en sus dos anchos */
  photo?: Photo;
  /** Imagen suelta (p. ej. la del producto, que viene de la API) */
  src?: string;
  alt: string;
  ratio?: MediaRatio;
  /** Ocupa todo el alto del contenedor padre en vez de imponer proporción */
  fill?: boolean;
  /** Elige la variante de placeholder de forma estable */
  seed?: number;
  /** Clases del contenedor (bordes, sombra, radios) */
  className?: string;
  /** Clases de la imagen (object-position, escala en hover) */
  imgClassName?: string;
  /** Anchos que ocupará la imagen, para que el navegador elija del `srcSet` */
  sizes?: string;
  /** La primera imagen visible del hero no debe ser lazy */
  priority?: boolean;
};

export function Media({
  photo,
  src,
  alt,
  ratio = "4/5",
  fill = false,
  seed = 0,
  className,
  imgClassName,
  sizes,
  priority = false,
  ...props
}: MediaProps) {
  const resolvedSrc = photo?.src ?? src;
  const theme =
    placeholderThemes[Math.abs(seed) % placeholderThemes.length] ?? placeholderThemes[0];

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-surface-sunken",
        fill ? "h-full w-full" : ratios[ratio],
        className,
      )}
    >
      {resolvedSrc ? (
        <img
          src={resolvedSrc}
          srcSet={photo?.srcSet}
          sizes={photo ? (sizes ?? "(max-width: 640px) 100vw, 640px") : undefined}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          decoding={priority ? "sync" : "async"}
          fetchPriority={priority ? "high" : "auto"}
          className={cn("h-full w-full object-cover", imgClassName)}
          {...props}
        />
      ) : (
        <FlowerPlaceholder theme={theme} label={alt} />
      )}
    </div>
  );
}

function FlowerPlaceholder({ theme, label }: { theme: PlaceholderTheme; label: string }) {
  return (
    <svg
      viewBox="0 0 400 500"
      preserveAspectRatio="xMidYMid slice"
      className="h-full w-full"
      role={label ? "img" : "presentation"}
      aria-label={label || undefined}
      aria-hidden={label ? undefined : true}
    >
      <defs>
        <linearGradient id={`mg-${theme.core.slice(1)}`} x1="0" y1="0" x2="0.6" y2="1">
          <stop offset="0%" stopColor={theme.from} />
          <stop offset="100%" stopColor={theme.to} />
        </linearGradient>
      </defs>
      <rect width="400" height="500" fill={`url(#mg-${theme.core.slice(1)})`} />
      <g transform="translate(200 250)" opacity="0.55">
        {[0, 45, 90, 135].map((deg) => (
          <ellipse
            key={deg}
            rx="34"
            ry="86"
            fill={theme.petal}
            transform={`rotate(${deg})`}
            opacity="0.75"
          />
        ))}
        <circle r="22" fill={theme.core} opacity="0.85" />
      </g>
      <g stroke={theme.petal} strokeWidth="2" fill="none" opacity="0.4">
        <path d="M0 420 C 90 380, 150 440, 240 400 S 360 430, 400 396" />
        <path d="M0 460 C 110 424, 170 480, 260 444 S 370 470, 400 440" />
      </g>
    </svg>
  );
}
