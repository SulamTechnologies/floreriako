import { SITE_URL, business } from "@/config/business";
import { FAQS } from "@/config/landing";
import type { ProductWithCategoriesDTO } from "@/types/api";

/**
 * Constructores de JSON-LD (schema.org).
 *
 * Todo sale de `config/business.ts` y `config/landing.ts`, así que el marcado
 * estructurado nunca contradice lo que ve el usuario en pantalla, Google
 * penaliza justo esa discrepancia.
 */

type Json = Record<string, unknown>;

const ORG_ID = `${SITE_URL}/#florist`;

/**
 * `Florist` es un subtipo de `LocalBusiness`: da acceso al panel de negocio
 * local (mapa, horario, teléfono) en los resultados de búsqueda.
 */
export function floristSchema(): Json {
  return {
    "@context": "https://schema.org",
    "@type": "Florist",
    "@id": ORG_ID,
    name: business.legalName,
    description: business.description,
    url: SITE_URL,
    image: `${SITE_URL}/og-image.jpg`,
    telephone: business.contact.phone,
    // Un campo vacío en el schema es peor que ausente: se omite si no hay dato
    ...(business.contact.email ? { email: business.contact.email } : {}),
    priceRange: `$${business.priceRange.min}, $${business.priceRange.max}`,
    currenciesAccepted: business.currency,
    paymentAccepted: business.paymentMethods.join(", "),
    foundingDate: String(business.foundedYear),
    address: {
      "@type": "PostalAddress",
      // Negocio de área de servicio: sin tienda al público no se publica la
      // calle. Google espera exactamente eso para este tipo de negocio.
      ...(business.hasStorefront ? { streetAddress: business.address.street } : {}),
      addressLocality: business.address.city,
      addressRegion: business.address.state,
      postalCode: business.address.postalCode,
      addressCountry: business.address.countryCode,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: business.geo.latitude,
      longitude: business.geo.longitude,
    },
    openingHoursSpecification: business.hours.map((slot) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: slot.days,
      opens: slot.opens,
      closes: slot.closes,
    })),
    areaServed: business.deliveryZones.map((zone) => ({
      "@type": "City",
      name: zone,
    })),
    sameAs: [business.social.instagram, business.social.facebook, business.social.tiktok].filter(
      Boolean,
    ),
    // Sin `aggregateRating`: no hay reseñas verificables todavía y Google
    // penaliza las calificaciones que no existen en el sitio.
  };
}

/** Habilita la caja de búsqueda del sitio en los resultados de Google */
export function websiteSchema(): Json {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: business.name,
    inLanguage: business.locale,
    publisher: { "@id": ORG_ID },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/productos?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function faqSchema(): Json {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

export function breadcrumbSchema(trail: { name: string; path: string }[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((step, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: step.name,
      item: `${SITE_URL}${step.path}`,
    })),
  };
}

export function productSchema(product: ProductWithCategoriesDTO): Json {
  const url = `${SITE_URL}/productos/${product.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description ?? business.description,
    sku: product.id,
    url,
    ...(product.image_url ? { image: product.image_url } : {}),
    brand: { "@type": "Brand", name: business.name },
    category: product.categories[0]?.name,
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: product.currency,
      // schema.org espera unidades, no centavos
      price: (product.price_cents / 100).toFixed(2),
      availability:
        product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      seller: { "@id": ORG_ID },
      areaServed: business.deliveryZones.map((zone) => ({ "@type": "City", name: zone })),
    },
  };
}

/** Lista de productos de una categoría o búsqueda */
export function itemListSchema(products: ProductWithCategoriesDTO[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    numberOfItems: products.length,
    itemListElement: products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${SITE_URL}/productos/${product.slug}`,
      name: product.name,
    })),
  };
}
