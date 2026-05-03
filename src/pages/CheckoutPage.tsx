import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingBag, ArrowLeft, Flower2, CreditCard, Lock } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/features/cart/useCart";
import { useStripeCheckout } from "@/features/checkout/api";
import { formatPrice } from "@/shared/lib/format";

export default function CheckoutPage() {
  const { items, total_cents, item_count } = useCart();
  const { mutate: startCheckout, isPending } = useStripeCheckout();

  function handlePay() {
    startCheckout(undefined, {
      onSuccess: ({ checkout_url }) => {
        window.location.href = checkout_url;
      },
      onError: (err: unknown) => {
        const msg = err instanceof Error ? err.message : "Error al iniciar el pago";
        toast.error(msg);
      },
    });
  }

  if (item_count === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <ShoppingBag className="w-12 h-12 text-gray-200 mx-auto mb-4" strokeWidth={1} />
        <p className="text-gray-500 mb-6">Tu carrito está vacío</p>
        <Link
          to="/productos"
          className="inline-flex items-center gap-2 bg-brand-600 text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-brand-700 transition-colors"
        >
          Ver productos
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link
        to="/carrito"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Regresar al carrito
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-8">Confirmar pedido</h1>

      <div className="grid gap-6">
        {/* Order summary */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
        >
          <div className="px-5 py-4 border-b border-gray-50">
            <h2 className="font-semibold text-gray-900">Resumen del pedido</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {items.map((item) => (
              <div key={item.id} className="px-5 py-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center shrink-0 overflow-hidden">
                  {item.product_image_url ? (
                    <img
                      src={item.product_image_url}
                      alt={item.product_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Flower2 className="w-5 h-5 text-brand-400" strokeWidth={1.5} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{item.product_name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">Cantidad: {item.quantity}</p>
                </div>
                <p className="text-sm font-semibold text-gray-900">
                  {formatPrice(item.subtotal_cents)}
                </p>
              </div>
            ))}
          </div>
          <div className="px-5 py-4 bg-gray-50 space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>
                Subtotal ({item_count} {item_count === 1 ? "artículo" : "artículos"})
              </span>
              <span>{formatPrice(total_cents)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-400">
              <span>Envío</span>
              <span>Por coordinar</span>
            </div>
            <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-gray-200">
              <span>Total</span>
              <span>{formatPrice(total_cents)}</span>
            </div>
          </div>
        </motion.div>

        {/* Pay button */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-3"
        >
          <button
            onClick={handlePay}
            disabled={isPending}
            className="w-full flex items-center justify-center gap-2.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-2xl transition-colors"
          >
            <CreditCard className="w-5 h-5" strokeWidth={1.5} />
            {isPending ? "Redirigiendo a Stripe..." : `Pagar ${formatPrice(total_cents)}`}
          </button>

          <p className="flex items-center justify-center gap-1.5 text-xs text-gray-400">
            <Lock className="w-3.5 h-3.5" />
            Pago seguro procesado por Stripe
          </p>
        </motion.div>
      </div>
    </div>
  );
}
