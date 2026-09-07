import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronLeft, ChevronRight, SlidersHorizontal, X } from "lucide-react";
import { useProducts } from "@/features/products/api";
import { ProductGrid } from "@/features/products/components/ProductGrid";
import { ProductGridSkeleton } from "@/features/products/components/ProductSkeleton";
import { cn } from "@/shared/lib/cn";
import { business } from "@/config/business";
import { CATEGORIES, CATEGORY_SLUGS } from "@/config/catalog";
import { JsonLd, Seo, breadcrumbSchema, itemListSchema } from "@/shared/seo";

const PER_PAGE = 12;

/** Tope de la búsqueda: la URL es entrada de usuario */
const SEARCH_MAX = 100;

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState((searchParams.get("search") ?? "").slice(0, SEARCH_MAX));

  const rawCategory = searchParams.get("category") ?? undefined;
  // Un slug arbitrario en la URL no debe llegar a la API
  const category = rawCategory && CATEGORY_SLUGS.has(rawCategory) ? rawCategory : undefined;
  const page = Math.max(1, Number(searchParams.get("page") ?? "1") || 1);
  const activeSearch = (searchParams.get("search") ?? "").slice(0, SEARCH_MAX) || undefined;

  const { data, isLoading, isError } = useProducts({
    category,
    page,
    per_page: PER_PAGE,
    search: activeSearch,
  });

  function setCategory(slug: string | undefined) {
    setSearchParams((prev) => {
      if (slug) prev.set("category", slug);
      else prev.delete("category");
      prev.delete("page");
      return prev;
    });
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setSearchParams((prev) => {
      if (search) prev.set("search", search);
      else prev.delete("search");
      prev.delete("page");
      return prev;
    });
  }

  function clearSearch() {
    setSearch("");
    setSearchParams((prev) => {
      prev.delete("search");
      return prev;
    });
  }

  function setPage(p: number) {
    setSearchParams((prev) => {
      prev.set("page", String(p));
      return prev;
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const totalPages = data ? Math.ceil(data.total / PER_PAGE) : 0;

  const activeCategory = CATEGORIES.find((c) => c.slug === category);
  const seoTitle = activeSearch
    ? `Resultados para "${activeSearch}"`
    : activeCategory
      ? `${activeCategory.name}, catálogo de flores`
      : "Catálogo de flores, ramos y arreglos";
  const seoDescription = activeCategory
    ? `${activeCategory.description}. Entrega a domicilio en ${business.deliveryAreaLabel}.`
    : `Explora ramos, arreglos y plantas con entrega a domicilio en ${business.address.city}. Desde $${business.priceRange.min} MXN y pago seguro en línea.`;

  return (
    <div className="min-h-screen">
      <Seo
        title={seoTitle}
        description={seoDescription}
        path={activeCategory ? `/productos?category=${activeCategory.slug}` : "/productos"}
        // Las búsquedas y las páginas 2+ no aportan al índice y generan duplicados
        noIndex={Boolean(activeSearch) || page > 1}
      />
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Inicio", path: "/" },
            { name: "Catálogo", path: "/productos" },
            ...(activeCategory
              ? [{ name: activeCategory.name, path: `/productos?category=${activeCategory.slug}` }]
              : []),
          ]),
          ...(data?.data?.length ? [itemListSchema(data.data)] : []),
        ]}
      />
      {/* Page header */}
      <div className="border-b border-line bg-surface-raised">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="font-display mb-1 text-display-sm font-semibold text-ink">Catálogo</h1>
            {data && <p className="text-sm text-ink-muted">{data.total} productos disponibles</p>}
          </motion.div>

          {/* Search + filters row */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <form onSubmit={handleSearch} className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
              <input
                type="text"
                value={search}
                maxLength={SEARCH_MAX}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar flores, arreglos..."
                className="w-full rounded-xl border border-line-strong bg-surface-sunken py-2.5 pl-10 pr-10 text-sm transition-all focus:border-transparent focus:bg-surface-raised focus:outline-none focus:ring-2 focus:ring-brand-400"
              />
              <AnimatePresence>
                {search && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    type="button"
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink-soft"
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                )}
              </AnimatePresence>
            </form>

            <button
              type="submit"
              form=""
              onClick={handleSearch}
              className="sm:w-auto flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Buscar
            </button>
          </div>

          {/* Category pills */}
          <div className="flex flex-wrap gap-2 mt-4">
            <button
              onClick={() => setCategory(undefined)}
              className={cn(
                "text-sm font-medium px-4 py-1.5 rounded-full border transition-all duration-200",
                !category
                  ? "bg-brand-600 text-white border-brand-600 shadow-sm shadow-brand-200"
                  : "border-line-strong bg-surface-raised text-ink-soft hover:border-brand-400 hover:text-ink-brand",
              )}
            >
              Todos
            </button>
            {CATEGORIES.map((cat) => (
              <motion.button
                key={cat.slug}
                onClick={() => setCategory(cat.slug)}
                whileTap={{ scale: 0.96 }}
                className={cn(
                  "text-sm font-medium px-4 py-1.5 rounded-full border transition-all duration-200",
                  category === cat.slug
                    ? "bg-brand-600 text-white border-brand-600 shadow-sm shadow-brand-200"
                    : "border-line-strong bg-surface-raised text-ink-soft hover:border-brand-400 hover:text-ink-brand",
                )}
              >
                {cat.name}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Sin `AnimatePresence` aquí a propósito: con transición de salida, el
            esqueleto seguía montado esperando a que terminara la animación y la
            rejilla entraba debajo, empujando la página. El intercambio directo
            no salta y no depende de que el bucle de animación avance. */}
        {isLoading ? (
          <ProductGridSkeleton />
        ) : isError ? (
          <div className="py-20 text-center">
            <p className="font-medium text-danger-600">Error al cargar los productos.</p>
            <p className="mt-1 text-sm text-ink-muted">Intenta recargar la página.</p>
          </div>
        ) : data ? (
          <motion.div
            key={`${category}-${activeSearch}-${page}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <ProductGrid products={data.data} />
          </motion.div>
        ) : null}

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center items-center gap-3 mt-12"
          >
            <button
              onClick={() => setPage(page - 1)}
              disabled={page <= 1}
              className="flex items-center gap-1 rounded-xl border border-line-strong px-4 py-2 text-sm font-medium text-ink-soft transition-colors hover:border-brand-400 hover:text-ink-brand disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" /> Anterior
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                .reduce<(number | "...")[]>((acc, p, i, arr) => {
                  if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("...");
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, i) =>
                  p === "..." ? (
                    <span key={`ellipsis-${i}`} className="px-2 text-sm text-ink-muted">
                      …
                    </span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setPage(p as number)}
                      className={cn(
                        "w-9 h-9 rounded-xl text-sm font-medium transition-colors",
                        page === p
                          ? "bg-brand-700 text-white"
                          : "text-ink-soft hover:bg-surface-sunken",
                      )}
                    >
                      {p}
                    </button>
                  ),
                )}
            </div>

            <button
              onClick={() => setPage(page + 1)}
              disabled={page >= totalPages}
              className="flex items-center gap-1 rounded-xl border border-line-strong px-4 py-2 text-sm font-medium text-ink-soft transition-colors hover:border-brand-400 hover:text-ink-brand disabled:opacity-40"
            >
              Siguiente <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
