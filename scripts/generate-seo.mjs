/**
 * Genera `public/robots.txt` y `public/sitemap.xml` antes del build.
 *
 * Los slugs de categoría se leen de `src/config/catalog.ts` para que la
 * taxonomía viva en un solo archivo. Los productos se piden a la API si está
 * disponible; si no responde, el sitemap se genera igual con las rutas
 * estáticas, nunca rompe el build.
 *
 * Se ejecuta con `npm run build` (hook `prebuild`).
 */

import { readFile, writeFile } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const SITE_URL = (process.env.VITE_SITE_URL ?? "https://floreriako.com").replace(/\/$/, "");
const API_URL = (process.env.VITE_API_URL ?? "").replace(/\/$/, "");

/** Rutas privadas o sin valor de indexación */
const DISALLOW = [
  "/cuenta",
  "/carrito",
  "/checkout",
  "/pedido",
  "/admin",
  "/login",
  "/registro",
  "/productos?search=",
];

async function readCategorySlugs() {
  try {
    const source = await readFile(resolve(root, "src/config/catalog.ts"), "utf8");
    const slugs = [...source.matchAll(/^\s{4}slug:\s*"([a-z0-9-]+)"/gm)].map((m) => m[1]);
    return [...new Set(slugs)];
  } catch {
    console.warn("[seo] No se pudo leer catalog.ts, sitemap sin categorías");
    return [];
  }
}

/** Tope que impone la validación de la API en `per_page` */
const PER_PAGE = 48;

async function fetchProductSlugs() {
  if (!API_URL) {
    console.warn("[seo] VITE_API_URL sin definir, sitemap sin productos");
    return [];
  }

  const slugs = [];
  try {
    for (let page = 1; page <= 20; page += 1) {
      const response = await fetch(`${API_URL}/api/products?per_page=${PER_PAGE}&page=${page}`, {
        signal: AbortSignal.timeout(8000),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const payload = await response.json();
      const batch = (payload?.data ?? []).map((product) => product.slug).filter(Boolean);
      slugs.push(...batch);
      if (batch.length < PER_PAGE || slugs.length >= (payload?.total ?? 0)) break;
    }
    return slugs;
  } catch (error) {
    console.warn(
      `[seo] La API no respondió (${error.message}), sitemap con ${slugs.length} productos`,
    );
    return slugs;
  }
}

function urlEntry({ path, priority, changefreq, lastmod }) {
  return [
    "  <url>",
    `    <loc>${SITE_URL}${path}</loc>`,
    `    <lastmod>${lastmod}</lastmod>`,
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    "  </url>",
  ].join("\n");
}

async function main() {
  const lastmod = new Date().toISOString().slice(0, 10);
  const [categories, products] = await Promise.all([readCategorySlugs(), fetchProductSlugs()]);

  const entries = [
    { path: "/", priority: "1.0", changefreq: "daily" },
    { path: "/productos", priority: "0.9", changefreq: "daily" },
    ...categories.map((slug) => ({
      path: `/productos?category=${slug}`,
      priority: "0.8",
      changefreq: "weekly",
    })),
    ...products.map((slug) => ({
      path: `/productos/${slug}`,
      priority: "0.7",
      changefreq: "weekly",
    })),
    { path: "/legal/privacidad", priority: "0.3", changefreq: "yearly" },
    { path: "/legal/terminos", priority: "0.3", changefreq: "yearly" },
  ];

  const sitemap = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries.map((entry) => urlEntry({ ...entry, lastmod })),
    "</urlset>",
    "",
  ].join("\n");

  const robots = [
    "User-agent: *",
    "Allow: /",
    ...DISALLOW.map((path) => `Disallow: ${path}`),
    "",
    `Sitemap: ${SITE_URL}/sitemap.xml`,
    "",
  ].join("\n");

  await writeFile(resolve(root, "public/sitemap.xml"), sitemap, "utf8");
  await writeFile(resolve(root, "public/robots.txt"), robots, "utf8");

  console.log(
    `[seo] sitemap.xml con ${entries.length} URLs (${categories.length} categorías, ${products.length} productos) y robots.txt generados`,
  );
}

await main();
