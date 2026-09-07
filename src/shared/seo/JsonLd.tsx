/**
 * Inserta un bloque de datos estructurados.
 *
 * Va en el cuerpo del documento a propósito: Google acepta JSON-LD en
 * cualquier parte del HTML, y así el bloque viaja con la página que lo
 * describe en vez de acumularse en un `<head>` global.
 *
 * El tipo MIME no es ejecutable, por lo que la CSP `script-src 'self'` no lo
 * bloquea.
 */
export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      // El contenido lo generamos nosotros desde config, nunca viene del usuario
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
