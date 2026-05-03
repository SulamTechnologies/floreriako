import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  ChevronDown,
  ChevronUp,
  ImageOff,
  TrendingUp,
  Clock,
  Truck,
  CheckCircle,
} from "lucide-react";
import { useAdminOrders, useUpdateOrderStatus } from "@/features/admin/api";
import { formatPrice } from "@/shared/lib/format";
import { cn } from "@/shared/lib/cn";
import { toast } from "sonner";
import type { AdminOrderDTO } from "@/types/api";

type StatusFilter = "all" | AdminOrderDTO["status"];

const STATUS_LABELS: Record<string, string> = {
  pending: "Pendiente",
  paid: "Pagado",
  shipped: "En camino",
  delivered: "Entregado",
  cancelled: "Cancelado",
};

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  paid: "bg-blue-50 text-blue-700 border-blue-200",
  shipped: "bg-purple-50 text-purple-700 border-purple-200",
  delivered: "bg-green-50 text-green-700 border-green-200",
  cancelled: "bg-red-50 text-red-600 border-red-200",
};

const STATUS_NEXT: Record<string, AdminOrderDTO["status"] | null> = {
  pending: "paid",
  paid: "shipped",
  shipped: "delivered",
  delivered: null,
  cancelled: null,
};

const STATUSES: AdminOrderDTO["status"][] = [
  "pending",
  "paid",
  "shipped",
  "delivered",
  "cancelled",
];

const FILTERS: { key: StatusFilter; label: string }[] = [
  { key: "all", label: "Todos" },
  { key: "pending", label: "Pendientes" },
  { key: "paid", label: "Pagados" },
  { key: "shipped", label: "En camino" },
  { key: "delivered", label: "Entregados" },
  { key: "cancelled", label: "Cancelados" },
];

function OrderRow({
  order,
  onStatusChange,
}: {
  order: AdminOrderDTO;
  onStatusChange: (id: string, status: AdminOrderDTO["status"]) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const nextStatus = STATUS_NEXT[order.status];

  return (
    <div className="border-b border-gray-50 last:border-0">
      {/* Row */}
      <div
        className="grid grid-cols-[1fr_160px_100px_110px_auto] gap-4 px-5 py-4 items-center hover:bg-gray-50/60 transition-colors cursor-pointer group"
        onClick={() => setExpanded((v) => !v)}
      >
        {/* Order ID + item count */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center shrink-0">
            <ShoppingBag className="w-3.5 h-3.5 text-brand-400" strokeWidth={1.5} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-mono font-semibold text-gray-900">
              #{order.id.slice(0, 8).toUpperCase()}
            </p>
            <p className="text-xs text-gray-400 truncate">
              {order.user_email ?? "—"} · {order.items.length}{" "}
              {order.items.length === 1 ? "artículo" : "artículos"}
            </p>
          </div>
        </div>

        {/* Date */}
        <span className="text-sm text-gray-500">
          {new Date(order.created_at).toLocaleDateString("es-MX", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </span>

        {/* Total */}
        <span className="text-sm font-semibold text-gray-900">
          {formatPrice(order.total_cents)}
        </span>

        {/* Status badge */}
        <span
          className={cn(
            "text-xs font-semibold px-2.5 py-1 rounded-full border w-fit",
            STATUS_COLORS[order.status] ?? "bg-gray-50 text-gray-500 border-gray-200",
          )}
        >
          {STATUS_LABELS[order.status] ?? order.status}
        </span>

        {/* Expand chevron */}
        <div className="flex items-center">
          {expanded ? (
            <ChevronUp className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-300 group-hover:text-gray-400 transition-colors" />
          )}
        </div>
      </div>

      {/* Expanded detail */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-4 space-y-4">
              {/* Items */}
              <div className="bg-gray-50 rounded-2xl overflow-hidden">
                {order.items.map((item) => {
                  const snap = item.product_snapshot as {
                    name?: string;
                    image_url?: string | null;
                  };
                  return (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 last:border-0"
                    >
                      <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 overflow-hidden flex items-center justify-center shrink-0">
                        {snap?.image_url ? (
                          <img
                            src={snap.image_url}
                            alt={snap.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ImageOff className="w-4 h-4 text-gray-200" strokeWidth={1.5} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {snap?.name ?? "Producto"}
                        </p>
                        <p className="text-xs text-gray-400">
                          {item.quantity} × {formatPrice(item.unit_price_cents)}
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-gray-900 shrink-0">
                        {formatPrice(item.quantity * item.unit_price_cents)}
                      </p>
                    </div>
                  );
                })}
                <div className="flex justify-between px-4 py-3 bg-white">
                  <span className="text-sm font-semibold text-gray-900">Total</span>
                  <span className="text-sm font-bold text-gray-900">
                    {formatPrice(order.total_cents)}
                  </span>
                </div>
              </div>

              {/* Status actions */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-gray-400 mr-1">Cambiar estado:</span>
                {STATUSES.map((s) => (
                  <button
                    key={s}
                    onClick={(e) => {
                      e.stopPropagation();
                      onStatusChange(order.id, s);
                    }}
                    disabled={order.status === s}
                    className={cn(
                      "text-xs font-semibold px-3 py-1.5 rounded-full border transition-all",
                      order.status === s
                        ? cn(
                            STATUS_COLORS[s],
                            "cursor-default ring-2 ring-offset-1",
                            s === "pending"
                              ? "ring-amber-300"
                              : s === "paid"
                                ? "ring-blue-300"
                                : s === "shipped"
                                  ? "ring-purple-300"
                                  : s === "delivered"
                                    ? "ring-green-300"
                                    : "ring-red-300",
                          )
                        : "bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:text-gray-700",
                    )}
                  >
                    {STATUS_LABELS[s]}
                  </button>
                ))}
                {nextStatus && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onStatusChange(order.id, nextStatus);
                    }}
                    className="ml-auto flex items-center gap-1.5 text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white px-3 py-1.5 rounded-full transition-colors"
                  >
                    <Truck className="w-3 h-3" />
                    Marcar como {STATUS_LABELS[nextStatus]}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function AdminOrdersPage() {
  const { data: orders = [], isLoading } = useAdminOrders();
  const { mutate: updateStatus } = useUpdateOrderStatus();
  const [filter, setFilter] = useState<StatusFilter>("all");

  const stats = useMemo(() => {
    const revenue = orders
      .filter((o) => o.status !== "cancelled")
      .reduce((sum, o) => sum + o.total_cents, 0);
    return {
      total: orders.length,
      pending: orders.filter((o) => o.status === "pending").length,
      paid: orders.filter((o) => o.status === "paid").length,
      shipped: orders.filter((o) => o.status === "shipped").length,
      delivered: orders.filter((o) => o.status === "delivered").length,
      revenue,
    };
  }, [orders]);

  const filtered = useMemo(
    () => (filter === "all" ? orders : orders.filter((o) => o.status === filter)),
    [orders, filter],
  );

  function handleStatusChange(id: string, status: AdminOrderDTO["status"]) {
    updateStatus(
      { id, status },
      {
        onSuccess: () => toast.success(`Estado actualizado a ${STATUS_LABELS[status]}`),
        onError: () => toast.error("Error al actualizar estado"),
      },
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Pedidos</h1>
        <p className="text-sm text-gray-400 mt-0.5">Gestiona y actualiza los pedidos</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          {
            label: "Ingresos totales",
            value: formatPrice(stats.revenue),
            icon: TrendingUp,
            color: "text-brand-600 bg-brand-50",
          },
          {
            label: "Pendientes",
            value: stats.pending,
            icon: Clock,
            color: "text-amber-600 bg-amber-50",
          },
          {
            label: "En camino",
            value: stats.shipped,
            icon: Truck,
            color: "text-purple-600 bg-purple-50",
          },
          {
            label: "Entregados",
            value: stats.delivered,
            icon: CheckCircle,
            color: "text-green-600 bg-green-50",
          },
        ].map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="bg-white rounded-2xl border border-gray-100 px-5 py-4 flex items-center gap-3"
          >
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${color}`}
            >
              <Icon className="w-4 h-4" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900 leading-none">{value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-1.5 bg-gray-100 p-1 rounded-xl mb-5 w-fit flex-wrap">
        {FILTERS.map(({ key, label }) => {
          const count =
            key === "all" ? orders.length : orders.filter((o) => o.status === key).length;
          return (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                filter === key
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700",
              )}
            >
              {label}
              {count > 0 && (
                <span
                  className={cn(
                    "text-[10px] font-bold px-1.5 py-0.5 rounded-full",
                    filter === key ? "bg-brand-100 text-brand-700" : "bg-gray-200 text-gray-500",
                  )}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Orders list */}
      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-16 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <ShoppingBag className="w-10 h-10 mx-auto mb-3 opacity-30" strokeWidth={1} />
          <p className="text-sm">
            Sin pedidos{filter !== "all" ? ` con estado "${STATUS_LABELS[filter]}"` : ""}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-[1fr_160px_100px_110px_auto] gap-4 px-5 py-2.5 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase tracking-wide">
            <span>Pedido</span>
            <span>Fecha</span>
            <span>Total</span>
            <span>Estado</span>
            <span />
          </div>
          <div>
            {filtered.map((order) => (
              <OrderRow key={order.id} order={order} onStatusChange={handleStatusChange} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
