import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MotionConfig } from "framer-motion";
import { routeObjects } from "./route-tree";
import { SITE_URL } from "./config/business";

/**
 * Entrada SSR del prerender.
 *
 * `scripts/prerender.mjs` compila este archivo con `vite build --ssr`, llama
 * `renderRoute()` por cada ruta pública e inyecta el resultado en el
 * `dist/index.html` que produjo el build del cliente.
 *
 * Existe porque los crawlers y los previsualizadores de redes sociales no
 * ejecutan JavaScript: sin esto solo verían `<div id="root"></div>`.
 *
 * Lo que NO hace: no precarga datos de la API. Las secciones que dependen de
 * `useQuery` se generan en su estado de carga y se llenan en el cliente. El
 * contenido editorial del landing, el que posiciona, sí queda completo.
 *
 * En el cliente se monta con `createRoot`, no con `hydrateRoot`: el carrito de
 * invitado vive en localStorage y provocaría desajustes de hidratación. El HTML
 * estático sirve al crawler y al primer pintado, y React vuelve a montar
 * encima. Migrar a hidratación cuando se toque la lógica del carrito.
 */

/** Rutas que se generan como HTML estático (sin querystring: son archivos) */
export const PRERENDER_ROUTES = ["/", "/productos", "/legal/privacidad", "/legal/terminos"];

export type RenderedRoute = {
  html: string;
  title?: string;
  /** Etiquetas `<meta>` y `<link>` ya serializadas, listas para el `<head>` */
  headTags: string[];
};

const TITLE = /<title>([\s\S]*?)<\/title>/i;
const HOISTABLE = /<(meta|link)\b[^>]*?\s*\/?>/gi;

function decodeEntities(value: string) {
  return value
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

/**
 * El renderizador estático de React 19 deja algunos atributos en camelCase
 * (`srcSet`, `fetchPriority`). El parser de HTML los normaliza igual, pero un
 * validador los marca, así que se emiten en minúsculas.
 */
function normalizeAttributes(html: string) {
  return html.replace(/ srcSet=/g, " srcset=").replace(/ fetchPriority=/g, " fetchpriority=");
}

/**
 * React 19 emite `<title>`, `<meta>` y `<link>` en línea cuando se renderiza un
 * subárbol sin `<head>`. Los sacamos del cuerpo para colocarlos donde importan.
 */
function extractHead(rendered: string): RenderedRoute {
  let html = normalizeAttributes(rendered);
  let title: string | undefined;

  const titleMatch = html.match(TITLE);
  if (titleMatch?.[1]) {
    title = decodeEntities(titleMatch[1]);
    html = html.replace(TITLE, "");
  }

  const headTags: string[] = [];
  html = html.replace(HOISTABLE, (tag) => {
    headTags.push(tag);
    return "";
  });

  return { html, title, headTags };
}

export async function renderRoute(url: string): Promise<RenderedRoute> {
  const [{ prerender }, { createStaticHandler, createStaticRouter, StaticRouterProvider }] =
    await Promise.all([import("react-dom/static"), import("react-router")]);

  const handler = createStaticHandler(routeObjects);
  const context = await handler.query(new Request(new URL(url, SITE_URL)));

  // Una redirección no tiene HTML que generar
  if (context instanceof Response) return { html: "", headTags: [] };

  const staticRouter = createStaticRouter(handler.dataRoutes, context);

  // Cliente nuevo por ruta: sin caché compartida entre páginas generadas
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, staleTime: Infinity } },
  });

  const { prelude } = await prerender(
    <QueryClientProvider client={queryClient}>
      <MotionConfig reducedMotion="user">
        <StaticRouterProvider router={staticRouter} context={context} hydrate={false} />
      </MotionConfig>
    </QueryClientProvider>,
  );

  // `Response` vacía el ReadableStream a texto sin depender de APIs de Node
  const rendered = await new Response(prelude).text();

  return extractHead(rendered);
}
