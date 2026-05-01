import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, ArrowRight, Trash2, Plus, Minus, ImageOff, Flower2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useUIStore } from "@/store/ui";
import { useCart } from "../useCart";
import { useAuthStore } from "@/store/auth";
import { formatPrice } from "@/shared/lib/format";
import type { CartItemDTO } from "@/types/api";

function CartItem({ item }: { item: CartItemDTO }) {
  const { updateQuantity, removeItem } = useCart();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20, height: 0 }}
      transition={{ duration: 0.2 }}
      className="flex gap-3 py-4"
    >
      {/* Image */}
      <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
        {item.product_image_url ? (
          <img
            src={item.product_image_url}
            alt={item.product_name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageOff className="w-6 h-6 text-gray-300" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{item.product_name}</p>
        <p className="text-xs text-gray-400 mt-0.5">{formatPrice(item.unit_price_cents)} c/u</p>

        {/* Quantity controls */}
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
            className="w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-brand-400 hover:text-brand-600 transition-colors"
          >
            <Minus className="w-3 h-3" />
          </button>
          <span className="text-sm font-semibold w-4 text-center">{item.quantity}</span>
          <button
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            className="w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-brand-400 hover:text-brand-600 transition-colors"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Subtotal + remove */}
      <div className="flex flex-col items-end justify-between">
        <p className="text-sm font-semibold text-gray-900">{formatPrice(item.subtotal_cents)}</p>
        <button
          onClick={() => removeItem(item.id)}
          className="text-gray-300 hover:text-red-400 transition-colors"
          aria-label="Eliminar"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}

export function CartDrawer() {
  const { cartOpen, closeCart } = useUIStore();
  const { items, total_cents, item_count } = useCart();
  const user = useAuthStore((s) => s.user);

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.aside
            key="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-white shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-brand-600" strokeWidth={1.5} />
                <h2 className="text-lg font-semibold text-gray-900">
                  Tu carrito
                  {item_count > 0 && (
                    <span className="ml-2 text-sm font-normal text-gray-400">({item_count})</span>
                  )}
                </h2>
              </div>
              <button
                onClick={closeCart}
                className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 py-16">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="w-16 h-16 rounded-full bg-brand-50 flex items-center justify-center"
                  >
                    <Flower2 className="w-8 h-8 text-brand-300" strokeWidth={1} />
                  </motion.div>
                  <p className="text-gray-400 text-sm">Tu carrito está vacío</p>
                  <button
                    onClick={closeCart}
                    className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700"
                  >
                    Seguir comprando <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  <div className="divide-y divide-gray-50">
                    {items.map((item) => (
                      <CartItem key={item.id} item={item} />
                    ))}
                  </div>
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-6 py-4 border-t border-gray-100 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Subtotal</span>
                  <span className="font-semibold text-gray-900">{formatPrice(total_cents)}</span>
                </div>
                <p className="text-xs text-gray-400">Envío calculado al pagar</p>

                {user ? (
                  <button
                    disabled
                    className="w-full flex items-center justify-center gap-2 bg-brand-600 text-white rounded-xl py-3 text-sm font-semibold opacity-60 cursor-not-allowed"
                  >
                    Pagar — próximamente <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <Link
                    to="/login"
                    onClick={closeCart}
                    className="flex items-center justify-center gap-2 w-full bg-brand-600 hover:bg-brand-700 text-white rounded-xl py-3 text-sm font-semibold transition-colors"
                  >
                    Iniciar sesión para pagar <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
