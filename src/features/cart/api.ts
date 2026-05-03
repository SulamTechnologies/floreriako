import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/shared/api/client";
import type { CartDTO } from "@/types/api";

export const CART_KEY = ["cart"] as const;

export function useServerCart(enabled: boolean) {
  return useQuery<CartDTO>({
    queryKey: CART_KEY,
    queryFn: ({ signal }) => api.get<CartDTO>("/api/cart", signal),
    enabled,
    staleTime: 1000 * 30,
  });
}

export function useAddToCart() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { product_id: string; quantity: number }) =>
      api.post<CartDTO>("/api/cart", payload),
    onMutate: async () => {
      await qc.cancelQueries({ queryKey: CART_KEY });
    },
    onSuccess: (data) => qc.setQueryData(CART_KEY, data),
  });
}

export function useUpdateCartItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, quantity }: { id: string; quantity: number }) =>
      api.patch<CartDTO>(`/api/cart/items/${id}`, { quantity }),
    onMutate: async () => {
      await qc.cancelQueries({ queryKey: CART_KEY });
    },
    onSuccess: (data) => qc.setQueryData(CART_KEY, data),
  });
}

export function useRemoveCartItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete<CartDTO>(`/api/cart/items/${id}`),
    onMutate: async () => {
      await qc.cancelQueries({ queryKey: CART_KEY });
    },
    onSuccess: (data) => qc.setQueryData(CART_KEY, data),
  });
}

export function useMergeCart() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (items: Array<{ product_id: string; quantity: number }>) =>
      api.post<CartDTO>("/api/cart/merge", { items }),
    onMutate: async () => {
      await qc.cancelQueries({ queryKey: CART_KEY });
    },
    onSuccess: (data) => qc.setQueryData(CART_KEY, data),
  });
}
