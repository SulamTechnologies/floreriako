import { useEffect, useRef } from "react";
import { useAuthStore } from "@/store/auth";
import { useCartStore } from "@/store/cart";
import { useMergeCart } from "./api";

export function useCartSync() {
  const user = useAuthStore((s) => s.user);
  const guestItems = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const mergeCart = useMergeCart();
  const merged = useRef(false);

  useEffect(() => {
    if (!user) {
      merged.current = false;
      return;
    }
    if (merged.current) return;
    merged.current = true;

    if (guestItems.length > 0) {
      mergeCart.mutate(
        guestItems.map((i) => ({ product_id: i.product_id, quantity: i.quantity })),
        { onSuccess: () => clearCart() },
      );
    } else {
      clearCart();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);
}
