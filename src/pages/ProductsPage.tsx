import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronLeft, ChevronRight, SlidersHorizontal, X } from "lucide-react";
import { useProducts } from "@/features/products/api";
import { ProductGrid } from "@/features/products/components/ProductGrid";
import { ProductGridSkeleton } from "@/features/products/components/ProductSkeleton";
import { cn } from "@/shared/lib/cn";

const CATEGORIES = [
  { slug: "arreglos", name: "Arreglos" },
  { slug: "ramos", name: "Ramos" },
  { slug: "coronas", name: "Coronas" },
  { slug: "plantas", name: "Plantas" },
  { slug: "ocasiones-especiales", name: "Ocasiones especiales" },
];

const PER_PAGE = 12;

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") ?? "");

  const category = searchParams.get("category") ?? undefined;
  const page = Number(searchParams.get("page") ?? "1");
  const activeSearch = searchParams.get("search") ?? undefined;

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

  return (
    <div className="min-h-screen">
      {/* Page header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Catálogo</h1>
            {data && <p className="text-sm text-gray-400">{data.total} productos disponibles</p>}
          </motion.div>

          {/* Search + filters row */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <form onSubmit={handleSearch} className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar flores, arreglos..."
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white focus:border-transparent transition-all"
              />
              <AnimatePresence>
                {search && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    type="button"
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
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
                  : "bg-white text-gray-600 border-gray-200 hover:border-brand-400 hover:text-brand-700",
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
                    : "bg-white text-gray-600 border-gray-200 hover:border-brand-400 hover:text-brand-700",
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
        <AnimatePresence mode="wait">
          {isLoading && (
            <motion.div
              key="skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ProductGridSkeleton />
            </motion.div>
          )}

          {isError && (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="text-red-500 font-medium">Error al cargar los productos.</p>
              <p className="text-sm text-gray-400 mt-1">Intenta recargar la página.</p>
            </motion.div>
          )}

          {data && (
            <motion.div
              key={`${category}-${activeSearch}-${page}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              <ProductGrid products={data.data} />
            </motion.div>
          )}
        </AnimatePresence>

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
              className="flex items-center gap-1 rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 disabled:opacity-40 hover:border-brand-400 hover:text-brand-700 transition-colors"
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
                    <span key={`ellipsis-${i}`} className="px-2 text-gray-400 text-sm">
                      …
                    </span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setPage(p as number)}
                      className={cn(
                        "w-9 h-9 rounded-xl text-sm font-medium transition-colors",
                        page === p ? "bg-brand-600 text-white" : "text-gray-600 hover:bg-gray-100",
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
              className="flex items-center gap-1 rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 disabled:opacity-40 hover:border-brand-400 hover:text-brand-700 transition-colors"
            >
              Siguiente <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
