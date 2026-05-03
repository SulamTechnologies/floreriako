import { useMutation } from "@tanstack/react-query";
import { api } from "@/shared/api/client";
import type { CheckoutResponseDTO } from "@/types/api";

export function useStripeCheckout() {
  return useMutation({
    mutationFn: () => api.post<CheckoutResponseDTO>("/api/checkout", {}),
  });
}
