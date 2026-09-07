import { useEffect } from "react";
import { useAuthStore } from "@/store/auth";
import { useCartStore } from "@/store/cart";
import { useMergeCart } from "./api";

const SESSION_KEY = "fko_cart_merged_uid";

export function useCartSync() {
  const user = useAuthStore((s) => s.user);
  const guestItems = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const mergeCart = useMergeCart();

  useEffect(() => {
    if (!user) {
      // Clear merge flag on logout so next login can merge fresh guest items
      sessionStorage.removeItem(SESSION_KEY);
      return;
    }

    // Already merged in this browser session for this user, skip
    if (sessionStorage.getItem(SESSION_KEY) === user.id) return;

    if (guestItems.length > 0) {
      mergeCart.mutate(
        guestItems.map((i) => ({ product_id: i.product_id, quantity: i.quantity })),
        {
          onSuccess: () => {
            clearCart();
            sessionStorage.setItem(SESSION_KEY, user.id);
          },
          // On error: keep guest items in localStorage, don't mark as merged
          // Next page reload will retry automatically
        },
      );
    } else {
      // No guest items, mark done so we don't check every re-render
      sessionStorage.setItem(SESSION_KEY, user.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);
}
