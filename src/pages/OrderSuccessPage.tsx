import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, Package, ArrowRight, Flower2 } from "lucide-react";
import { useOrder } from "@/features/orders/api";
import { formatPrice } from "@/shared/lib/format";

const STATUS_LABELS: Record<string, string> = {
  pending: "Pendiente",
  paid: "Pagado",
  shipped: "En camino",
  delivered: "Entregado",
  cancelled: "Cancelado",
};

export default function OrderSuccessPage() {
  const { id } = useParams<{ id: string }>();
  const { data: order, isLoading } = useOrder(id ?? "");

  if (isLoading) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="animate-pulse space-y-4">
          <div className="w-16 h-16 rounded-full bg-gray-100 mx-auto" />
          <div className="h-6 bg-gray-100 rounded-xl max-w-xs mx-auto" />
          <div className="h-4 bg-gray-100 rounded-xl max-w-xs mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="text-center mb-8"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
          className="w-20 h-20 rounded-full bg-brand-50 flex items-center justify-center mx-auto mb-5"
        >
          <CheckCircle className="w-10 h-10 text-brand-600" strokeWidth={1.5} />
        </motion.div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Pedido confirmado</h1>
        <p className="text-gray-500 text-sm">Te contactaremos pronto para coordinar la entrega.</p>
        {order && (
          <p className="mt-2 text-xs text-gray-400 font-mono">
            #{order.id.slice(0, 8).toUpperCase()}
          </p>
        )}
      </motion.div>

      {order && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-6"
        >
          <div className="px-5 py-4 border-b border-gray-50 flex items-center gap-2">
            <Package className="w-4 h-4 text-gray-400" strokeWidth={1.5} />
            <span className="font-semibold text-gray-900 text-sm">Detalles del pedido</span>
            <span className="ml-auto text-xs font-medium px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100">
              {STATUS_LABELS[order.status] ?? order.status}
            </span>
          </div>
          <div className="divide-y divide-gray-50">
            {order.items.map((item) => (
              <div key={item.id} className="px-5 py-3.5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center shrink-0">
                  {item.product_snapshot.image_url ? (
                    <img
                      src={item.product_snapshot.image_url}
                      alt={item.product_snapshot.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <Flower2 className="w-4 h-4 text-brand-400" strokeWidth={1.5} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {item.product_snapshot.name}
                  </p>
                  <p className="text-xs text-gray-400">x{item.quantity}</p>
                </div>
                <p className="text-sm font-semibold text-gray-900">
                  {formatPrice(item.unit_price_cents * item.quantity)}
                </p>
              </div>
            ))}
          </div>
          <div className="px-5 py-4 bg-gray-50 flex justify-between font-bold text-gray-900">
            <span>Total</span>
            <span>{formatPrice(order.total_cents)}</span>
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col sm:flex-row gap-3"
      >
        <Link
          to="/cuenta"
          className="flex-1 text-center bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 rounded-2xl transition-colors"
        >
          Ver mis pedidos
        </Link>
        <Link
          to="/productos"
          className="flex-1 inline-flex items-center justify-center gap-1.5 text-center border border-gray-200 hover:border-brand-400 text-gray-700 hover:text-brand-700 font-medium py-3 rounded-2xl transition-colors"
        >
          Seguir comprando <ArrowRight className="w-4 h-4" />
        </Link>
      </motion.div>
    </div>
  );
}
