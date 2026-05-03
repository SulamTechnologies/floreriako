import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/shared/api/client";
import type { AdminOrderDTO, AdminProductDTO, CategoryDTO } from "@/types/api";

// ── Categories ────────────────────────────────────────────────────────────────

export function useCategories() {
  return useQuery<CategoryDTO[]>({
    queryKey: ["categories"],
    queryFn: () => api.get<CategoryDTO[]>("/api/categories"),
    staleTime: 1000 * 60 * 10,
  });
}

// ── Products ──────────────────────────────────────────────────────────────────

const ADMIN_PRODUCTS_KEY = ["admin", "products"] as const;

export function useAdminProducts() {
  return useQuery<AdminProductDTO[]>({
    queryKey: ADMIN_PRODUCTS_KEY,
    queryFn: () => api.get<AdminProductDTO[]>("/api/admin/products"),
  });
}

export interface CreateProductPayload {
  name: string;
  slug: string;
  description?: string;
  price_cents: number;
  stock: number;
  image_url?: string;
  active?: boolean;
  category_ids?: string[];
}

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateProductPayload) =>
      api.post<AdminProductDTO>("/api/admin/products", data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ADMIN_PRODUCTS_KEY }),
  });
}

export function useUpdateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: Partial<CreateProductPayload> & { id: string }) =>
      api.patch<AdminProductDTO>(`/api/admin/products/${id}`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ADMIN_PRODUCTS_KEY }),
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete<{ success: boolean }>(`/api/admin/products/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ADMIN_PRODUCTS_KEY }),
  });
}

// ── Orders ────────────────────────────────────────────────────────────────────

const ADMIN_ORDERS_KEY = ["admin", "orders"] as const;

export function useAdminOrders() {
  return useQuery<AdminOrderDTO[]>({
    queryKey: ADMIN_ORDERS_KEY,
    queryFn: () => api.get<AdminOrderDTO[]>("/api/admin/orders"),
  });
}

export function useUpdateOrderStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: AdminOrderDTO["status"] }) =>
      api.patch<AdminOrderDTO>(`/api/admin/orders/${id}`, { status }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ADMIN_ORDERS_KEY }),
  });
}
