import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Search,
  ImageOff,
  Edit2,
  Trash2,
  Package,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import {
  useAdminProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
  type CreateProductPayload,
} from "@/features/admin/api";
import { ProductDrawer } from "@/features/admin/components/ProductDrawer";
import { ConfirmDialog } from "@/features/admin/components/ConfirmDialog";
import type { AdminProductDTO } from "@/types/api";
import { formatPrice } from "@/shared/lib/format";
import { cn } from "@/shared/lib/cn";
import { toast } from "sonner";

type Filter = "all" | "active" | "inactive" | "no-stock";

export default function AdminProductsPage() {
  const { data: products = [], isLoading } = useAdminProducts();
  const { mutate: createProduct, isPending: creating } = useCreateProduct();
  const { mutate: updateProduct, isPending: updating } = useUpdateProduct();
  const { mutate: deleteProduct } = useDeleteProduct();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<AdminProductDTO | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [deleteTarget, setDeleteTarget] = useState<AdminProductDTO | null>(null);

  // Stats
  const stats = useMemo(
    () => ({
      total: products.length,
      active: products.filter((p) => p.active).length,
      noStock: products.filter((p) => p.stock === 0).length,
    }),
    [products],
  );

  // Filtered list
  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.slug.toLowerCase().includes(search.toLowerCase());
      const matchFilter =
        filter === "all" ||
        (filter === "active" && p.active) ||
        (filter === "inactive" && !p.active) ||
        (filter === "no-stock" && p.stock === 0);
      return matchSearch && matchFilter;
    });
  }, [products, search, filter]);

  function openCreate() {
    setEditing(null);
    setDrawerOpen(true);
  }

  function openEdit(p: AdminProductDTO) {
    setEditing(p);
    setDrawerOpen(true);
  }

  function handleSubmit(payload: CreateProductPayload & { id?: string }) {
    const { id, ...data } = payload;
    if (id) {
      updateProduct(
        { id, ...data },
        {
          onSuccess: () => {
            toast.success("Producto actualizado");
            setDrawerOpen(false);
          },
          onError: (e) => toast.error(e instanceof Error ? e.message : "Error al actualizar"),
        },
      );
    } else {
      createProduct(data, {
        onSuccess: () => {
          toast.success("Producto creado");
          setDrawerOpen(false);
        },
        onError: (e) => toast.error(e instanceof Error ? e.message : "Error al crear"),
      });
    }
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    deleteProduct(deleteTarget.id, {
      onSuccess: () => {
        toast.success(`"${deleteTarget.name}" desactivado`);
        setDeleteTarget(null);
      },
      onError: () => toast.error("Error al desactivar"),
    });
  }

  const FILTERS: { key: Filter; label: string }[] = [
    { key: "all", label: "Todos" },
    { key: "active", label: "Activos" },
    { key: "inactive", label: "Inactivos" },
    { key: "no-stock", label: "Sin stock" },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Productos</h1>
          <p className="text-sm text-gray-400 mt-0.5">Gestiona el catálogo de la tienda</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-4 py-2.5 rounded-xl transition-colors text-sm shadow-sm shadow-brand-600/20"
        >
          <Plus className="w-4 h-4" /> Nuevo producto
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total", value: stats.total, icon: Package, color: "text-gray-600 bg-gray-50" },
          {
            label: "Activos",
            value: stats.active,
            icon: TrendingUp,
            color: "text-green-600 bg-green-50",
          },
          {
            label: "Sin stock",
            value: stats.noStock,
            icon: AlertTriangle,
            color: "text-red-500 bg-red-50",
          },
        ].map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="bg-white rounded-2xl border border-gray-100 px-5 py-4 flex items-center gap-3"
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color}`}>
              <Icon className="w-4 h-4" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 leading-none">{value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search + Filters */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre o slug..."
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-1.5 bg-gray-100 p-1 rounded-xl">
          {FILTERS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                filter === key
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700",
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Products list */}
      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <div key={n} className="h-16 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Package className="w-10 h-10 mx-auto mb-3 opacity-30" strokeWidth={1} />
          <p className="text-sm">Sin productos{search ? ` para "${search}"` : ""}</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-[56px_1fr_100px_72px_80px_76px] items-center gap-4 px-5 py-2.5 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase tracking-wide">
            <span />
            <span>Producto</span>
            <span>Precio</span>
            <span className="text-center">Stock</span>
            <span>Estado</span>
            <span />
          </div>

          <div className="divide-y divide-gray-50">
            {filtered.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.025 }}
                className={cn(
                  "grid grid-cols-[56px_1fr_100px_72px_80px_76px] items-center gap-4 px-5 py-3.5 hover:bg-gray-50/60 transition-colors group",
                  !product.active && "opacity-50",
                )}
              >
                {/* Thumbnail */}
                <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden flex items-center justify-center shrink-0">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ImageOff className="w-4 h-4 text-gray-200" strokeWidth={1.5} />
                  )}
                </div>

                {/* Name + categories */}
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-xs text-gray-400 font-mono truncate">{product.slug}</span>
                    {product.categories.slice(0, 2).map((cat) => (
                      <span
                        key={cat.id}
                        className="text-[10px] font-medium px-1.5 py-0.5 bg-brand-50 text-brand-600 rounded-full border border-brand-100"
                      >
                        {cat.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Price */}
                <span className="text-sm font-semibold text-gray-900">
                  {formatPrice(product.price_cents)}
                </span>

                {/* Stock */}
                <span
                  className={cn(
                    "text-sm font-semibold text-center",
                    product.stock === 0
                      ? "text-red-500"
                      : product.stock <= 5
                        ? "text-amber-500"
                        : "text-gray-700",
                  )}
                >
                  {product.stock}
                </span>

                {/* Status badge */}
                <span
                  className={cn(
                    "text-xs font-medium px-2 py-1 rounded-full border w-fit",
                    product.active
                      ? "bg-green-50 text-green-700 border-green-100"
                      : "bg-gray-50 text-gray-500 border-gray-200",
                  )}
                >
                  {product.active ? "Activo" : "Inactivo"}
                </span>

                {/* Actions */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openEdit(product)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-brand-600 hover:bg-brand-50 transition-colors"
                    title="Editar"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(product)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Desactivar"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Drawer */}
      <ProductDrawer
        key={editing?.id ?? (drawerOpen ? "new" : "closed")}
        open={drawerOpen}
        product={editing}
        onClose={() => setDrawerOpen(false)}
        onSubmit={handleSubmit}
        isPending={creating || updating}
      />

      {/* Confirm delete */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Desactivar producto"
        description={`"${deleteTarget?.name}" dejará de mostrarse en la tienda. Puedes reactivarlo editándolo.`}
        confirmLabel="Desactivar"
        destructive
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
