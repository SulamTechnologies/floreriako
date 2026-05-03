import { useState } from "react";
import { motion } from "framer-motion";
import { User, Package, ChevronRight, Flower2, Edit2, Check, X } from "lucide-react";
import { useOrders } from "@/features/orders/api";
import { useProfile, useUpdateProfile } from "@/features/orders/useProfile";
import { OrderDetail } from "@/features/orders/components/OrderDetail";
import { useAuthStore } from "@/store/auth";
import { formatPrice } from "@/shared/lib/format";
import { cn } from "@/shared/lib/cn";
import { toast } from "sonner";

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

export default function AccountPage() {
  const [tab, setTab] = useState<"orders" | "profile">("orders");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const { data: orders, isLoading: ordersLoading } = useOrders();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { mutate: updateProfile, isPending: saving } = useUpdateProfile();
  const user = useAuthStore((s) => s.user);

  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState("");

  function startEdit() {
    setFullName(profile?.full_name ?? "");
    setEditing(true);
  }

  function cancelEdit() {
    setEditing(false);
  }

  function saveProfile() {
    updateProfile(
      { full_name: fullName },
      {
        onSuccess: () => {
          setEditing(false);
          toast.success("Perfil actualizado");
        },
        onError: () => toast.error("Error al guardar"),
      },
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Mi cuenta</h1>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-8 w-fit">
        {(["orders", "profile"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
              tab === t ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700",
            )}
          >
            {t === "orders" ? <Package className="w-4 h-4" /> : <User className="w-4 h-4" />}
            {t === "orders" ? "Mis pedidos" : "Perfil"}
          </button>
        ))}
      </div>

      {/* Orders tab */}
      {tab === "orders" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {/* Order detail drill-down */}
          {selectedOrderId ? (
            <OrderDetail orderId={selectedOrderId} onBack={() => setSelectedOrderId(null)} />
          ) : (
            <>
              {ordersLoading && (
                <div className="space-y-3">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="h-24 bg-gray-100 rounded-2xl animate-pulse" />
                  ))}
                </div>
              )}

              {!ordersLoading && orders?.length === 0 && (
                <div className="text-center py-16">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                    <Package className="w-7 h-7 text-gray-300" strokeWidth={1.5} />
                  </div>
                  <p className="text-gray-500">Aún no tienes pedidos</p>
                </div>
              )}

              {!ordersLoading && orders && orders.length > 0 && (
                <div className="space-y-3">
                  {orders.map((order) => (
                    <motion.button
                      key={order.id}
                      onClick={() => setSelectedOrderId(order.id)}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileTap={{ scale: 0.99 }}
                      className="w-full bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-4 hover:border-brand-200 hover:shadow-sm transition-all group text-left cursor-pointer"
                    >
                      <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center shrink-0">
                        <Flower2 className="w-5 h-5 text-brand-500" strokeWidth={1.5} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-mono text-gray-400">
                            #{order.id.slice(0, 8).toUpperCase()}
                          </span>
                          <span
                            className={cn(
                              "text-xs font-medium px-2 py-0.5 rounded-full border",
                              STATUS_COLORS[order.status] ??
                                "bg-gray-50 text-gray-500 border-gray-100",
                            )}
                          >
                            {STATUS_LABELS[order.status] ?? order.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">
                          {order.items.length} {order.items.length === 1 ? "artículo" : "artículos"}{" "}
                          · {formatPrice(order.total_cents)}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {new Date(order.created_at).toLocaleDateString("es-MX", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-brand-400 transition-colors" />
                    </motion.button>
                  ))}
                </div>
              )}
            </>
          )}
        </motion.div>
      )}

      {/* Profile tab */}
      {tab === "profile" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {profileLoading ? (
            <div className="space-y-3">
              {[1, 2].map((n) => (
                <div key={n} className="h-16 bg-gray-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
                <h2 className="font-semibold text-gray-900">Información personal</h2>
                {!editing && (
                  <button
                    onClick={startEdit}
                    className="flex items-center gap-1.5 text-sm text-brand-600 hover:text-brand-700 font-medium"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Editar
                  </button>
                )}
              </div>
              <div className="divide-y divide-gray-50">
                <div className="px-5 py-4">
                  <p className="text-xs text-gray-400 mb-1">Correo electrónico</p>
                  <p className="text-sm text-gray-900">{user?.email}</p>
                </div>
                <div className="px-5 py-4">
                  <p className="text-xs text-gray-400 mb-1">Nombre completo</p>
                  {editing ? (
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Tu nombre"
                        className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                        autoFocus
                      />
                      <button
                        onClick={saveProfile}
                        disabled={saving}
                        className="p-1.5 rounded-lg bg-brand-600 text-white hover:bg-brand-700 disabled:opacity-60 transition-colors"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-900">
                      {profile?.full_name ?? (
                        <span className="text-gray-400 italic">Sin nombre</span>
                      )}
                    </p>
                  )}
                </div>
                <div className="px-5 py-4">
                  <p className="text-xs text-gray-400 mb-1">Tipo de cuenta</p>
                  <span className="inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full bg-brand-50 text-brand-700 border border-brand-100">
                    {profile?.role === "admin" ? "Administrador" : "Cliente"}
                  </span>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
