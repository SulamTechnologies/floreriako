import { useAuthStore } from "@/store/auth";
import { useCartStore } from "@/store/cart";
import { useServerCart, useAddToCart, useUpdateCartItem, useRemoveCartItem } from "./api";
import type { CartItemDTO } from "@/types/api";

export interface AddItemPayload {
  product_id: string;
  product_name: string;
  product_image_url: string | null;
  unit_price_cents: number;
  quantity?: number;
}

export interface UseCartReturn {
  items: CartItemDTO[];
  total_cents: number;
  item_count: number;
  isLoading: boolean;
  addItem: (
    payload: AddItemPayload,
    callbacks?: { onSuccess?: () => void; onError?: (err: unknown) => void },
  ) => void;
  updateQuantity: (idOrProductId: string, quantity: number) => void;
  removeItem: (idOrProductId: string) => void;
}

export function useCart(): UseCartReturn {
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = Boolean(user);

  // Server cart
  const { data: serverCart, isLoading } = useServerCart(isAuthenticated);
  const addToCart = useAddToCart();
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveCartItem();

  // Guest cart
  const guestItems = useCartStore((s) => s.items);
  const guestAdd = useCartStore((s) => s.addItem);
  const guestUpdate = useCartStore((s) => s.updateQuantity);
  const guestRemove = useCartStore((s) => s.removeItem);
  const guestTotal = useCartStore((s) => s.total_cents)();
  const guestCount = useCartStore((s) => s.item_count)();

  if (isAuthenticated) {
    const items = serverCart?.items ?? [];
    return {
      items,
      total_cents: serverCart?.total_cents ?? 0,
      item_count: serverCart?.item_count ?? 0,
      isLoading,
      addItem: (payload, callbacks) => {
        addToCart.mutate(
          { product_id: payload.product_id, quantity: payload.quantity ?? 1 },
          { onSuccess: callbacks?.onSuccess, onError: callbacks?.onError },
        );
      },
      updateQuantity: (id, quantity) => {
        updateItem.mutate({ id, quantity });
      },
      removeItem: (id) => {
        removeItem.mutate(id);
      },
    };
  }

  // Guest mode — map local items to CartItemDTO shape
  const guestDTOItems: CartItemDTO[] = guestItems.map((i) => ({
    id: i.product_id,
    product_id: i.product_id,
    product_name: i.product_name,
    product_image_url: i.product_image_url,
    quantity: i.quantity,
    unit_price_cents: i.unit_price_cents,
    subtotal_cents: i.unit_price_cents * i.quantity,
  }));

  return {
    items: guestDTOItems,
    total_cents: guestTotal,
    item_count: guestCount,
    isLoading: false,
    addItem: (payload, callbacks) => {
      guestAdd(payload, payload.quantity ?? 1);
      callbacks?.onSuccess?.();
    },
    updateQuantity: (productId, quantity) => guestUpdate(productId, quantity),
    removeItem: (productId) => guestRemove(productId),
  };
}
