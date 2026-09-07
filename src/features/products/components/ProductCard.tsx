import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import type { ProductWithCategoriesDTO } from "@/types/api";
import { formatPrice } from "@/shared/lib/format";
import { useCart } from "@/features/cart/useCart";
import { useUIStore } from "@/store/ui";
import { Media } from "@/shared/ui/primitives";

interface Props {
  product: ProductWithCategoriesDTO;
  index?: number;
  /** La primera fila de la rejilla no debe cargar en lazy */
  priority?: boolean;
}

export function ProductCard({ product, index = 0, priority = false }: Props) {
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

  const outOfStock = product.stock === 0;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.4, delay: Math.min(index, 7) * 0.05, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex flex-col overflow-hidden rounded-card border border-line bg-surface-raised transition-all duration-300 hover:-translate-y-1 hover:border-line-brand hover:shadow-raised"
    >
      <Link to={`/productos/${product.slug}`} className="flex flex-1 flex-col">
        <div className="relative">
          <Media
            src={product.image_url ?? undefined}
            alt={product.name}
            ratio="4/3"
            seed={index}
            priority={priority}
            imgClassName="transition-transform duration-500 group-hover:scale-105"
          />

          {product.categories[0] ? (
            <span className="absolute left-3 top-3 rounded-pill border border-white/60 bg-white/90 px-2.5 py-1 text-xs font-medium text-ink-soft backdrop-blur-sm">
              {product.categories[0].name}
            </span>
          ) : null}

          {outOfStock ? (
            <div className="absolute inset-0 flex items-center justify-center bg-surface/70 backdrop-blur-sm">
              <span className="rounded-pill border border-line bg-surface-raised px-3 py-1 text-xs font-semibold text-ink-muted">
                Sin stock
              </span>
            </div>
          ) : null}
        </div>

        <div className="flex flex-1 flex-col p-4">
          <h3 className="mb-auto line-clamp-2 font-semibold leading-tight text-ink">
            {product.name}
          </h3>
          <div className="mt-3 flex items-end justify-between gap-2">
            <span className="tabular text-lg font-bold text-ink-brand">
              {formatPrice(product.price_cents)}
            </span>
            {product.stock > 0 && product.stock <= 5 ? (
              <span className="text-xs font-medium text-danger-600">Últimos {product.stock}</span>
            ) : null}
          </div>
        </div>
      </Link>

      <div className="px-4 pb-4">
        <motion.button
          type="button"
          onClick={handleAddToCart}
          disabled={outOfStock}
          whileTap={{ scale: 0.97 }}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-700 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-800 disabled:cursor-not-allowed disabled:bg-surface-sunken disabled:text-ink-muted"
        >
          <ShoppingBag className="h-4 w-4" strokeWidth={1.75} />
          {outOfStock ? "Sin stock" : "Agregar"}
        </motion.button>
      </div>
    </motion.article>
  );
}
