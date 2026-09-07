import { PHOTOS, type Photo } from "@/assets/photos";
import { CATEGORIES, OCCASIONS } from "./catalog";

/**
 * Estructura de navegación de la topbar y del footer.
 * Un link simple no abre panel; un link con `panel` abre mega-menú.
 */

export type NavPanelItem = {
  label: string;
  href: string;
  description?: string;
};

export type NavItem = {
  label: string;
  href: string;
  panel?: {
    /** Columna principal del mega-menú */
    items: NavPanelItem[];
    /** Tarjeta destacada a la derecha del panel */
    feature?: {
      eyebrow: string;
      title: string;
      description: string;
      href: string;
      cta: string;
      photo?: Photo;
      seed: number;
    };
  };
};

export const MAIN_NAV: NavItem[] = [
  {
    label: "Tienda",
    href: "/productos",
    panel: {
      items: CATEGORIES.map((c) => ({
        label: c.name,
        href: `/productos?category=${c.slug}`,
        description: c.description,
      })),
      feature: {
        eyebrow: "Entrega a domicilio",
        title: "Te lo llevamos",
        description: "Cobertura en Los Mochis y alrededores. Consulta tu zona por WhatsApp.",
        href: "/productos",
        cta: "Ver catálogo",
        photo: PHOTOS.gerberasFucsia,
        seed: 0,
      },
    },
  },
  {
    label: "Ocasiones",
    href: "/productos",
    panel: {
      items: OCCASIONS.map((o) => ({ label: o.name, href: o.href })),
      feature: {
        eyebrow: "Eventos",
        title: "Bodas y XV años",
        description: "Cotización y montaje a medida. Escríbenos por WhatsApp.",
        href: "/productos?category=ocasiones-especiales",
        cta: "Cotizar evento",
        photo: PHOTOS.corazonFlores,
        seed: 2,
      },
    },
  },
  { label: "Cómo funciona", href: "/#como-funciona" },
  { label: "Contacto", href: "/#contacto" },
];

/** Columnas del footer, se completan con datos de `business` en el componente */
export const FOOTER_NAV = [
  {
    title: "Tienda",
    links: [
      { label: "Todos los productos", href: "/productos" },
      ...CATEGORIES.map((c) => ({ label: c.name, href: `/productos?category=${c.slug}` })),
    ],
  },
  {
    title: "Ocasiones",
    links: OCCASIONS.map((o) => ({ label: o.name, href: o.href })),
  },
  {
    title: "Ayuda",
    links: [
      { label: "Cómo funciona", href: "/#como-funciona" },
      { label: "Zonas de entrega", href: "/#entregas" },
      { label: "Preguntas frecuentes", href: "/#faq" },
      { label: "Mi cuenta", href: "/cuenta" },
      { label: "Contacto", href: "/#contacto" },
    ],
  },
] as const;
