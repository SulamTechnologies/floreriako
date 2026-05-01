import { motion } from "framer-motion";
import { SearchX } from "lucide-react";
import type { ProductWithCategoriesDTO } from "@/types/api";
import { ProductCard } from "./ProductCard";

interface Props {
  products: ProductWithCategoriesDTO[];
}

export function ProductGrid({ products }: Props) {
  if (products.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-24 text-gray-400 gap-3"
      >
        <SearchX className="w-12 h-12" strokeWidth={1} />
        <p className="text-base font-medium text-gray-600">No encontramos productos</p>
        <p className="text-sm">Intenta con otra búsqueda o categoría</p>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product, i) => (
        <ProductCard key={product.id} product={product} index={i} />
      ))}
    </div>
  );
}
