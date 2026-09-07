/**
 * Prerender post-build.
 *
 * Toma el `dist/index.html` que produjo el build del cliente y, por cada ruta
 * pública, inyecta el HTML renderizado en servidor más sus etiquetas de `<head>`.
 * El resultado son archivos estáticos que los crawlers leen sin ejecutar JS,
 * mientras el bundle del cliente sigue tomando el control al cargar.
 *
 * Si algo falla, avisa y termina con éxito: el sitio queda como SPA (indexación
 * más pobre, pero funcional). Un fallo de SEO no debe tumbar un despliegue.
 *
 * Se ejecuta desde `npm run build`, después de `vite build`.
 */

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const distDir = resolve(root, "dist");
const ssrEntry = resolve(root, "dist-ssr/prerender.js");

const ROOT_DIV = /<div id="root"><\/div>/;
const TEMPLATE_TITLE = /<title>[\s\S]*?<\/title>\s*/i;
const TEMPLATE_DESCRIPTION = /<meta\s+name="description"[\s\S]*?\/>\s*/i;

function injectHead(template, { title, headTags }) {
  let html = template;

  // El título y la descripción del template son los genéricos: la ruta manda
  if (title) {
    html = html.replace(TEMPLATE_TITLE, "");
    html = html.replace(TEMPLATE_DESCRIPTION, "");
  }

  const tags = [...(title ? [`<title>${title}</title>`] : []), ...headTags]
    .map((tag) => `    ${tag}`)
    .join("\n");

  // Reemplazo por función: en un string de reemplazo, `$$`, `$&` y `$1` son
  // secuencias especiales y el HTML renderizado puede contenerlas ("$$" en
  // priceRange, por ejemplo).
  return html.replace("</head>", () => `${tags}\n  </head>`);
}

async function writeRoute(route, template, rendered) {
  const html = injectHead(template, rendered).replace(
    ROOT_DIV,
    () => `<div id="root">${rendered.html}</div>`,
  );

  const target =
    route === "/" ? resolve(distDir, "index.html") : resolve(distDir, `.${route}/index.html`);

  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, html, "utf8");

  return { route, bytes: Buffer.byteLength(html) };
}

async function main() {
  const template = await readFile(resolve(distDir, "index.html"), "utf8");

  if (!ROOT_DIV.test(template)) {
    throw new Error('dist/index.html no contiene <div id="root"></div>');
  }

  const { PRERENDER_ROUTES, renderRoute } = await import(pathToFileURL(ssrEntry).href);

  const results = [];
  for (const route of PRERENDER_ROUTES) {
    const rendered = await renderRoute(route);
    if (!rendered.html) {
      console.warn(`[prerender] ${route} no produjo HTML, se omite`);
      continue;
    }
    results.push(await writeRoute(route, template, rendered));
  }

  console.log(`[prerender] ${results.length} rutas generadas:`);
  for (const { route, bytes } of results) {
    console.log(`  ${route.padEnd(22)} ${(bytes / 1024).toFixed(1)} kB`);
  }
}

try {
  await main();
} catch (error) {
  console.warn(`[prerender] omitido: ${error.message}`);
  console.warn("[prerender] el sitio se despliega como SPA; revisar antes de publicar");
}

// El árbol de la app puede dejar timers abiertos (auth, animaciones). Ya
// escribimos todo, así que cerramos en vez de esperar a que el loop se vacíe.
process.exit(0);
