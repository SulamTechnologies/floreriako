import { motion } from "framer-motion";
import { ArrowLeft, ImageOff, Package } from "lucide-react";
import { useOrder } from "../api";
import { formatPrice } from "@/shared/lib/format";
import { cn } from "@/shared/lib/cn";

const STATUS_LABELS: Record<string, string> = {
  pending: "Pendiente",
  paid: "Pagado",
  shipped: "En camino",
  delivered: "Entregado",
  cancelled: "Cancelado",
};

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-100",
  paid: "bg-blue-50 text-blue-700 border-blue-100",
  shipped: "bg-purple-50 text-purple-700 border-purple-100",
  delivered: "bg-green-50 text-green-700 border-green-100",
  cancelled: "bg-red-50 text-red-700 border-red-100",
};

interface Props {
  orderId: string;
  onBack: () => void;
}

export function OrderDetail({ orderId, onBack }: Props) {
  const { data: order, isLoading, isError } = useOrder(orderId);

  if (isLoading) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
        <div className="h-8 w-32 bg-gray-100 rounded-lg animate-pulse" />
        <div className="h-24 bg-gray-100 rounded-2xl animate-pulse" />
        <div className="h-48 bg-gray-100 rounded-2xl animate-pulse" />
        <div className="h-20 bg-gray-100 rounded-2xl animate-pulse" />
      </motion.div>
    );
  }

  if (isError || !order) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
        <Package className="w-10 h-10 text-gray-200 mx-auto mb-3" strokeWidth={1.5} />
        <p className="text-gray-500 text-sm">No se pudo cargar el pedido</p>
        <button
          onClick={onBack}
          className="mt-4 text-sm text-brand-600 hover:text-brand-700 font-medium"
        >
          Volver a mis pedidos
        </button>
      </motion.div>
    );
  }

  const statusColor = STATUS_COLORS[order.status] ?? "bg-gray-50 text-gray-500 border-gray-100";
  const statusLabel = STATUS_LABELS[order.status] ?? order.status;

  return (
    <motion.div
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-4"
    >
      {/* Back */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-brand-700 font-medium transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
        Mis pedidos
      </button>

      {/* Order header */}
      <div className="bg-white rounded-2xl border border-gray-100 px-5 py-4">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <p className="text-xs text-gray-400 mb-1">Número de pedido</p>
            <p className="font-mono font-semibold text-gray-900 text-sm">
              #{order.id.slice(0, 8).toUpperCase()}
            </p>
          </div>
          <span className={cn("text-xs font-semibold px-3 py-1 rounded-full border", statusColor)}>
            {statusLabel}
          </span>
        </div>
        <div className="mt-3 pt-3 border-t border-gray-50 flex items-center gap-4 text-sm text-gray-500">
          <span>
            {new Date(order.created_at).toLocaleDateString("es-MX", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
          <span className="text-gray-300">·</span>
          <span>
            {order.items.length} {order.items.length === 1 ? "artículo" : "artículos"}
          </span>
        </div>
      </div>

      {/* Items */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-50">
          <h3 className="text-sm font-semibold text-gray-900">Productos</h3>
        </div>
        <ul className="divide-y divide-gray-50">
          {order.items.map((item) => {
            const snap = item.product_snapshot as {
              name?: string;
              image_url?: string | null;
            };
            const name = snap?.name ?? "Producto";
            const imageUrl = snap?.image_url ?? null;
            const subtotal = item.quantity * item.unit_price_cents;

            return (
              <li key={item.id} className="flex items-center gap-4 px-5 py-4">
                {/* Thumbnail */}
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-stone-50 border border-gray-100 shrink-0">
                  {imageUrl ? (
                    <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageOff className="w-5 h-5 text-gray-200" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {item.quantity} × {formatPrice(item.unit_price_cents)}
                  </p>
                </div>

                {/* Subtotal */}
                <p className="text-sm font-semibold text-gray-900 shrink-0">
                  {formatPrice(subtotal)}
                </p>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Summary */}
      <div className="bg-white rounded-2xl border border-gray-100 px-5 py-4">
        <div className="flex justify-between text-sm text-gray-500 mb-2">
          <span>Subtotal</span>
          <span>{formatPrice(order.total_cents)}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-500 mb-3">
          <span>Envío</span>
          <span className="text-gray-400">Incluido</span>
        </div>
        <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
          <span className="font-semibold text-gray-900">Total</span>
          <span className="text-lg font-bold text-gray-900">{formatPrice(order.total_cents)}</span>
        </div>
      </div>
    </motion.div>
  );
}
