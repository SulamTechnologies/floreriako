import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/shared/api/client";
import type { OrderDTO } from "@/types/api";

export const ORDERS_KEY = ["orders"] as const;

export function useOrders() {
  return useQuery<OrderDTO[]>({
    queryKey: ORDERS_KEY,
    queryFn: () => api.get<OrderDTO[]>("/api/orders"),
    staleTime: 1000 * 60,
  });
}

export function useOrder(id: string) {
  return useQuery<OrderDTO>({
    queryKey: [...ORDERS_KEY, id],
    queryFn: () => api.get<OrderDTO>(`/api/orders/${id}`),
    enabled: !!id,
  });
}

export function useCreateOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.post<{ order_id: string }>("/api/orders", {}),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ORDERS_KEY });
      qc.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}
