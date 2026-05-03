import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  product_id: string;
  product_name: string;
  product_image_url: string | null;
  unit_price_cents: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (product_id: string) => void;
  updateQuantity: (product_id: string, quantity: number) => void;
  clearCart: () => void;
  total_cents: () => number;
  item_count: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item, quantity = 1) => {
        set((state) => {
          const existing = state.items.find((i) => i.product_id === item.product_id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.product_id === item.product_id ? { ...i, quantity: i.quantity + quantity } : i,
              ),
            };
          }
          return { items: [...state.items, { ...item, quantity }] };
        });
      },

      removeItem: (product_id) => {
        set((state) => ({
          items: state.items.filter((i) => i.product_id !== product_id),
        }));
      },

      updateQuantity: (product_id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(product_id);
          return;
        }
        set((state) => ({
          items: state.items.map((i) => (i.product_id === product_id ? { ...i, quantity } : i)),
        }));
      },

      clearCart: () => set({ items: [] }),

      total_cents: () => get().items.reduce((sum, i) => sum + i.unit_price_cents * i.quantity, 0),

      item_count: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    {
      name: "floreriako-cart",
    },
  ),
);
