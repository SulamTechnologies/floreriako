import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, ToggleLeft, ToggleRight, ImageOff, Tag } from "lucide-react";
import { useCategories, type CreateProductPayload } from "../api";
import type { AdminProductDTO } from "@/types/api";

interface Props {
  open: boolean;
  product: AdminProductDTO | null;
  onClose: () => void;
  onSubmit: (payload: CreateProductPayload & { id?: string }) => void;
  isPending: boolean;
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const EMPTY: CreateProductPayload = {
  name: "",
  slug: "",
  description: "",
  price_cents: 0,
  stock: 0,
  image_url: "",
  active: true,
  category_ids: [],
};

export function ProductDrawer({ open, product, onClose, onSubmit, isPending }: Props) {
  const { data: categories = [] } = useCategories();
  const [form, setForm] = useState<CreateProductPayload>(() =>
    product
      ? {
          name: product.name,
          slug: product.slug,
          description: product.description ?? "",
          price_cents: product.price_cents,
          stock: product.stock,
          image_url: product.image_url ?? "",
          active: product.active,
          category_ids: product.categories.map((c) => c.id),
        }
      : EMPTY,
  );
  const [imgError, setImgError] = useState(false);

  function handleNameChange(name: string) {
    setForm((f) => ({
      ...f,
      name,
      slug: product ? f.slug : slugify(name),
    }));
  }

  function toggleCategory(id: string) {
    setForm((f) => ({
      ...f,
      category_ids: f.category_ids?.includes(id)
        ? f.category_ids.filter((c) => c !== id)
        : [...(f.category_ids ?? []), id],
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      ...form,
      price_cents: Math.round(Number(form.price_cents)),
      stock: Math.round(Number(form.stock)),
      description: form.description || undefined,
      image_url: form.image_url || undefined,
      ...(product ? { id: product.id } : {}),
    };
    onSubmit(payload);
  }

  const hasImage = !!form.image_url && !imgError;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-40"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="fixed right-0 top-0 h-full w-full max-w-lg bg-white shadow-2xl z-50 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
              <h2 className="font-semibold text-gray-900">
                {product ? "Editar producto" : "Nuevo producto"}
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form body */}
            <form
              id="product-form"
              onSubmit={handleSubmit}
              className="flex-1 overflow-y-auto px-6 py-5 space-y-5"
            >
              {/* Image preview */}
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 flex items-center justify-center">
                {hasImage ? (
                  <img
                    src={form.image_url}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-gray-300">
                    <ImageOff className="w-8 h-8" strokeWidth={1} />
                    <span className="text-xs">Vista previa de imagen</span>
                  </div>
                )}
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  URL de imagen
                </label>
                <input
                  type="url"
                  value={form.image_url}
                  onChange={(e) => {
                    setImgError(false);
                    setForm((f) => ({ ...f, image_url: e.target.value }));
                  }}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  placeholder="https://..."
                />
              </div>

              {/* Name */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Nombre <span className="text-red-400">*</span>
                </label>
                <input
                  required
                  type="text"
                  value={form.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  placeholder="Ramo de rosas rojas"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Slug</label>
                <input
                  required
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-gray-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Descripción
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  rows={3}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-none"
                  placeholder="Describe el producto..."
                />
              </div>

              {/* Price + Stock */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">
                    Precio (MXN) <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                      $
                    </span>
                    <input
                      required
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.price_cents / 100}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          price_cents: Math.round(Number(e.target.value) * 100),
                        }))
                      }
                      className="w-full border border-gray-200 rounded-xl pl-7 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">
                    Stock <span className="text-red-400">*</span>
                  </label>
                  <input
                    required
                    type="number"
                    min="0"
                    value={form.stock}
                    onChange={(e) => setForm((f) => ({ ...f, stock: Number(e.target.value) }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Categories */}
              {categories.length > 0 && (
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-2">Categorías</label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => {
                      const selected = form.category_ids?.includes(cat.id);
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => toggleCategory(cat.id)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                            selected
                              ? "bg-brand-600 text-white border-brand-600"
                              : "bg-white text-gray-600 border-gray-200 hover:border-brand-300"
                          }`}
                        >
                          <Tag className="w-3 h-3" />
                          {cat.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Active toggle */}
              <div className="flex items-center gap-3 py-1">
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, active: !f.active }))}
                  className="transition-colors"
                >
                  {form.active ? (
                    <ToggleRight className="w-7 h-7 text-brand-600" />
                  ) : (
                    <ToggleLeft className="w-7 h-7 text-gray-300" />
                  )}
                </button>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {form.active ? "Activo" : "Inactivo"}
                  </p>
                  <p className="text-xs text-gray-400">
                    {form.active ? "Visible en la tienda" : "Oculto para clientes"}
                  </p>
                </div>
              </div>
            </form>

            {/* Footer */}
            <div className="flex gap-3 px-6 py-4 border-t border-gray-100 shrink-0 bg-white">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 border border-gray-200 text-gray-700 font-medium py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-sm"
              >
                Cancelar
              </button>
              <button
                type="submit"
                form="product-form"
                disabled={isPending}
                className="flex-1 bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
              >
                {isPending ? (
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>
                    Guardando...
                  </span>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    {product ? "Guardar cambios" : "Crear producto"}
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
