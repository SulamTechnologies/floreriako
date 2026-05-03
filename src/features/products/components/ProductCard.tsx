import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingBag, ImageOff } from "lucide-react";
import { toast } from "sonner";
import type { ProductWithCategoriesDTO } from "@/types/api";
import { formatPrice } from "@/shared/lib/format";
import { useCart } from "@/features/cart/useCart";
import { useUIStore } from "@/store/ui";

interface Props {
  product: ProductWithCategoriesDTO;
  index?: number;
}

export function ProductCard({ product, index = 0 }: Props) {
  const { addItem } = useCart();
  const { openCart } = useUIStore();

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    addItem(
      {
        product_id: product.id,
        product_name: product.name,
        product_image_url: product.image_url ?? null,
        unit_price_cents: product.price_cents,
      },
      {
        onSuccess: () => {
          toast.success(`${product.name} agregado`, {
            description: formatPrice(product.price_cents),
            action: { label: "Ver carrito", onClick: openCart },
            duration: 3000,
          });
        },
        onError: () => {
          toast.error(`No se pudo agregar ${product.name}`, {
            description: "Intenta de nuevo",
            duration: 3000,
          });
        },
      },
    );
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group relative flex flex-col rounded-2xl bg-white border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-gray-200/60 transition-all duration-300 hover:-translate-y-1"
    >
      <Link to={`/productos/${product.slug}`} className="flex flex-col flex-1">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-stone-50">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
              style={{ transform: "scale(1)" }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageOff className="w-10 h-10 text-gray-200" />
            </div>
          )}

          {/* Category badge */}
          {product.categories[0] && (
            <span className="absolute top-3 left-3 text-xs font-medium bg-white/90 backdrop-blur-sm text-gray-700 px-2.5 py-1 rounded-full border border-white/50">
              {product.categories[0].name}
            </span>
          )}

          {/* Out of stock overlay */}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
              <span className="text-xs font-semibold text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200">
                Sin stock
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="font-semibold text-gray-900 leading-tight line-clamp-2 mb-auto">
            {product.name}
          </h3>
          <div className="mt-3 flex items-end justify-between">
            <span className="text-lg font-bold text-brand-600">
              {formatPrice(product.price_cents)}
            </span>
            {product.stock > 0 && product.stock <= 5 && (
              <span className="text-xs text-amber-500 font-medium">Últimos {product.stock}</span>
            )}
          </div>
        </div>
      </Link>

      {/* Add to cart */}
      <div className="px-4 pb-4">
        <motion.button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          whileTap={{ scale: 0.97 }}
          className="w-full flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 disabled:bg-gray-100 disabled:text-gray-400 text-white disabled:cursor-not-allowed rounded-xl py-2.5 text-sm font-semibold transition-colors"
        >
          <ShoppingBag className="w-4 h-4" strokeWidth={1.5} />
          {product.stock === 0 ? "Sin stock" : "Agregar"}
        </motion.button>
      </div>
    </motion.article>
  );
}
