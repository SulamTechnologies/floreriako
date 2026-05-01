import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ShoppingBag, Minus, Plus, ImageOff, Package, Tag } from "lucide-react";
import { toast } from "sonner";
import { useProduct } from "@/features/products/api";
import { formatPrice } from "@/shared/lib/format";
import { useCart } from "@/features/cart/useCart";
import { useUIStore } from "@/store/ui";
import { cn } from "@/shared/lib/cn";

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { addItem } = useCart();
  const { openCart } = useUIStore();
  const [quantity, setQuantity] = useState(1);

  const { data: product, isLoading, isError } = useProduct(slug ?? "");

  function handleAddToCart() {
    if (!product) return;
    for (let i = 0; i < quantity; i++) {
      addItem({
        product_id: product.id,
        product_name: product.name,
        product_image_url: product.image_url ?? null,
        unit_price_cents: product.price_cents,
      });
    }
    toast.success(`${product.name} agregado`, {
      description: `${quantity} ${quantity === 1 ? "unidad" : "unidades"} · ${formatPrice(product.price_cents * quantity)}`,
      action: { label: "Ver carrito", onClick: openCart },
    });
  }

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 animate-pulse">
        <div className="h-4 w-32 bg-gray-100 rounded mb-8" />
        <div className="grid md:grid-cols-2 gap-10">
          <div className="aspect-square bg-gray-100 rounded-3xl" />
          <div className="space-y-4 py-4">
            <div className="h-8 bg-gray-100 rounded w-3/4" />
            <div className="h-4 bg-gray-100 rounded w-full" />
            <div className="h-4 bg-gray-100 rounded w-5/6" />
            <div className="h-8 bg-gray-100 rounded w-1/3 mt-6" />
            <div className="h-14 bg-gray-100 rounded-2xl mt-4" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-gray-500">Producto no encontrado.</p>
        <Link to="/productos" className="text-brand-600 hover:text-brand-700 text-sm font-medium">
          Ver todos los productos
        </Link>
      </div>
    );
  }

  const inStock = product.stock > 0;
  const maxQty = Math.min(product.stock, 99);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      {/* Back */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Link
          to="/productos"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-brand-700 transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          Volver al catálogo
        </Link>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
        {/* Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative aspect-square rounded-3xl overflow-hidden bg-stone-50"
        >
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageOff className="w-16 h-16 text-gray-200" />
            </div>
          )}

          {!inStock && (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center">
              <span className="text-sm font-semibold text-gray-600 bg-white border border-gray-200 px-4 py-2 rounded-full">
                Sin stock
              </span>
            </div>
          )}
        </motion.div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex flex-col py-2"
        >
          {/* Categories */}
          {product.categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {product.categories.map((cat) => (
                <span
                  key={cat.id}
                  className="inline-flex items-center gap-1 text-xs font-medium text-brand-700 bg-brand-50 px-3 py-1 rounded-full border border-brand-100"
                >
                  <Tag className="w-3 h-3" />
                  {cat.name}
                </span>
              ))}
            </div>
          )}

          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight mb-4">
            {product.name}
          </h1>

          {product.description && (
            <p className="text-gray-500 leading-relaxed mb-6">{product.description}</p>
          )}

          {/* Price */}
          <div className="mb-6">
            <p className="text-4xl font-bold text-brand-600">{formatPrice(product.price_cents)}</p>
            <p className="text-sm text-gray-400 mt-1">Precio por unidad · IVA incluido</p>
          </div>

          {/* Stock status */}
          <div
            className={cn(
              "flex items-center gap-2 text-sm font-medium mb-6 px-3 py-2 rounded-xl w-fit",
              inStock
                ? product.stock <= 5
                  ? "bg-amber-50 text-amber-700"
                  : "bg-green-50 text-green-700"
                : "bg-gray-50 text-gray-500",
            )}
          >
            <Package className="w-4 h-4" />
            {inStock
              ? product.stock <= 5
                ? `Solo ${product.stock} disponibles`
                : `${product.stock} en stock`
              : "Sin stock"}
          </div>

          {/* Quantity selector */}
          {inStock && (
            <div className="flex items-center gap-3 mb-6">
              <span className="text-sm font-medium text-gray-700">Cantidad:</span>
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl p-1">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-600 hover:bg-white hover:shadow-sm disabled:opacity-30 transition-all"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 text-center text-sm font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
                  disabled={quantity >= maxQty}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-600 hover:bg-white hover:shadow-sm disabled:opacity-30 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
              {quantity > 1 && (
                <motion.span
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-sm text-gray-500"
                >
                  = {formatPrice(product.price_cents * quantity)}
                </motion.span>
              )}
            </div>
          )}

          {/* Add to cart */}
          <motion.button
            onClick={handleAddToCart}
            disabled={!inStock}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 disabled:bg-gray-100 disabled:text-gray-400 text-white disabled:cursor-not-allowed rounded-2xl py-4 text-base font-semibold transition-all hover:shadow-lg hover:shadow-brand-600/25 hover:-translate-y-0.5"
          >
            <ShoppingBag className="w-5 h-5" strokeWidth={1.5} />
            {inStock ? "Agregar al carrito" : "Sin stock"}
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
