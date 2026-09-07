import { SITE_URL, business } from "@/config/business";

/**
 * Metadatos por ruta.
 *
 * React 19 eleva `<title>`, `<meta>` y `<link>` al `<head>` desde cualquier
 * punto del árbol, así que no hace falta react-helmet: basta con renderizar
 * estas etiquetas dentro de la página.
 *
 * El prerender del build fija estas mismas etiquetas en el HTML estático, que
 * es lo que leen los crawlers y los previsualizadores de redes sociales (que
 * no ejecutan JavaScript).
 */

const DEFAULT_IMAGE = "/og-image.jpg";

type SeoProps = {
  title: string;
  description: string;
  /** Ruta absoluta del sitio, sin dominio. Ej: "/productos" */
  path: string;
  /** Imagen para redes sociales, absoluta o relativa al sitio */
  image?: string;
  /** Páginas privadas (cuenta, checkout, admin) no deben indexarse */
  noIndex?: boolean;
  /** `product` para fichas de producto, `website` para el resto */
  type?: "website" | "article" | "product";
};

function absolute(path: string) {
  return path.startsWith("http") ? path : `${SITE_URL}${path}`;
}

export function Seo({
  title,
  description,
  path,
  image = DEFAULT_IMAGE,
  noIndex = false,
  type = "website",
}: SeoProps) {
  const url = absolute(path);
  const imageUrl = absolute(image);
  // El nombre de la marca va al final: los buscadores truncan por la derecha
  const fullTitle = path === "/" ? title : `${title} | ${business.name}`;

  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {noIndex ? <meta name="robots" content="noindex, nofollow" /> : null}

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={business.name} />
      <meta property="og:locale" content="es_MX" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={`${business.name}, ${business.tagline}`} />

      {/* Twitter / X */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />

      {/* Señales locales, refuerzan el negocio físico */}
      <meta name="geo.region" content={business.address.stateCode} />
      <meta name="geo.placename" content={business.address.city} />
    </>
  );
}
