/**
 * Fuente única de verdad de los datos del negocio.
 *
 * Se consume en: footer, topbar, sección de contacto, páginas legales y el
 * JSON-LD de SEO (Florist / LocalBusiness). Cambiar un dato aquí lo cambia en
 * todas partes, incluido el marcado estructurado que lee Google.
 */

export const business = {
  legalName: "Krystal Olivas Florería",
  name: "Krystal Olivas",
  /** Del logo de la marca */
  tagline: "Flores que dan luz",
  description:
    "Florería en Los Mochis, Sinaloa. Ramos y arreglos florales hechos a mano con entrega a domicilio.",

  /** CONFIRMAR, año de fundación, se usa en el copyright y en el schema */
  foundedYear: 2023,

  /**
   * No hay tienda física abierta al público: es un negocio de área de servicio.
   * Por eso el sitio no publica la calle ni invita a visitar, y el JSON-LD
   * omite `streetAddress`, que es lo que Google espera de este tipo de negocio.
   */
  hasStorefront: false,

  address: {
    /** NO se publica: sirve solo para facturación y trámites */
    street: "Palo de Guásima 1366",
    city: "Los Mochis",
    state: "Sinaloa",
    stateCode: "MX-SIN",
    postalCode: "81229",
    country: "México",
    countryCode: "MX",
  },

  /** CONFIRMAR, coordenadas aproximadas de Los Mochis, no de un local */
  geo: {
    latitude: 25.7935,
    longitude: -108.9954,
  },

  contact: {
    /** Formato E.164 para `tel:` y para el JSON-LD */
    phone: "+526626361813",
    /** Formato legible en pantalla */
    phoneDisplay: "662 636 1813",
    /** El mismo número del teléfono */
    whatsapp: "526626361813",
    /** Sin correo todavía: el footer y el JSON-LD lo omiten si está vacío */
    email: "",
  },

  /** Horarios en formato schema.org (24 h). Domingo cerrado. */
  hours: [
    {
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "09:00",
      closes: "17:00",
    },
  ],

  /** Los mismos horarios, agrupados para mostrar en pantalla */
  hoursDisplay: [
    { label: "Lunes a sábado", value: "9:00 – 17:00" },
    { label: "Domingo", value: "Cerrado" },
  ],

  social: {
    instagram: "https://www.instagram.com/krystal_olivasko/",
    facebook: "https://www.facebook.com/profile.php?id=100063441416544",
    tiktok: "https://www.tiktok.com/@floreriako3",
    whatsappUrl: "https://wa.me/526626361813",
  },

  /** Ciudades con cobertura confirmada, alimenta el `areaServed` del JSON-LD */
  deliveryZones: ["Los Mochis"],
  /** Cómo se nombra la cobertura en pantalla */
  deliveryAreaLabel: "Los Mochis, Sinaloa y alrededores",

  /** Rango de precios del catálogo, en MXN */
  priceRange: { min: 400, max: 3500 },

  paymentMethods: ["Tarjeta de crédito o débito en línea", "Transferencia", "Efectivo"],

  currency: "MXN",
  locale: "es-MX",
} as const;

/** URL canónica de producción. Usada en canonical, OG y sitemap. */
export const SITE_URL = "https://floreriako.com";

export type Business = typeof business;
