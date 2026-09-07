import { PHOTOS, type Photo } from "@/assets/photos";

/**
 * Taxonomía del catálogo, fuente única de verdad.
 *
 * Los `slug` deben coincidir con los de la tabla `categories` en Supabase.
 * Se consume en: mega-menú de la topbar, sección de categorías del landing,
 * filtros de /productos y sitemap.
 */

export type CategoryDef = {
  slug: string;
  name: string;
  /** Copy corto para el mega-menú y las cards del landing */
  description: string;
  /** Foto de la marca; sin ella se pinta el placeholder */
  photo?: Photo;
  /** Variante de placeholder cuando no hay foto */
  seed: number;
};

export const CATEGORIES: CategoryDef[] = [
  {
    slug: "arreglos",
    name: "Arreglos Florales",
    description: "Composiciones en base o caja, listas para regalar",
    photo: PHOTOS.corazonFlores,
    seed: 0,
  },
  {
    slug: "ramos",
    name: "Ramos",
    description: "Buqués envueltos a mano, del clásico al silvestre",
    photo: PHOTOS.rosasEucalipto,
    seed: 3,
  },
  {
    slug: "coronas",
    name: "Coronas y Guirnaldas",
    // En la base de datos esta categoría es "Coronas y Guirnaldas": coronas
    // decorativas de puerta, nada fúnebre.
    description: "Coronas decorativas de flores y follaje para tu puerta",
    // TODO: falta foto de coronas decorativas
    seed: 1,
  },
  {
    slug: "plantas",
    name: "Plantas",
    description: "Verde vivo que dura meses, no días",
    // TODO: falta foto de plantas; mientras se pinta el placeholder
    seed: 2,
  },
  {
    slug: "ocasiones-especiales",
    name: "Ocasiones Especiales",
    description: "Bodas, XV años y eventos con montaje incluido",
    photo: PHOTOS.rosasRojas,
    seed: 4,
  },
];

export const CATEGORY_SLUGS = new Set(CATEGORIES.map((c) => c.slug));

/**
 * Ocasiones, no son categorías de la base de datos, son atajos de búsqueda.
 * Cada una apunta a /productos con un filtro ya aplicado.
 */
export type OccasionDef = {
  key: string;
  name: string;
  /** Query string que se aplica al navegar */
  href: string;
  photo?: Photo;
  seed: number;
};

export const OCCASIONS: OccasionDef[] = [
  {
    key: "amor",
    name: "Amor y romance",
    href: "/productos?search=rosas",
    photo: PHOTOS.rosasRojas,
    seed: 0,
  },
  {
    key: "cumpleanos",
    name: "Cumpleaños",
    href: "/productos?search=cumplea%C3%B1os",
    photo: PHOTOS.gerberasFucsia,
    seed: 3,
  },
  {
    key: "aniversario",
    name: "Aniversario",
    href: "/productos?search=aniversario",
    photo: PHOTOS.rosasEucalipto,
    seed: 1,
  },
  {
    key: "dia-de-la-madre",
    name: "Día de la madre",
    href: "/productos?search=mam%C3%A1",
    photo: PHOTOS.pastelBlanco,
    seed: 2,
  },
  {
    key: "graduacion",
    name: "Graduación",
    href: "/productos?search=graduaci%C3%B3n",
    photo: PHOTOS.duraznoCrisantemos,
    seed: 4,
  },
  {
    key: "gracias",
    name: "Solo porque sí",
    href: "/productos",
    photo: PHOTOS.gerberasPerlas,
    seed: 0,
  },
];
