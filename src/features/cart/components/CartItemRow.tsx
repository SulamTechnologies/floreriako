import { ImageOff } from "lucide-react";
import { formatPrice } from "@/shared/lib/format";
import { useCart } from "../useCart";
import type { CartItemDTO } from "@/types/api";

interface Props {
  item: CartItemDTO;
}

export function CartItemRow({ item }: Props) {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className="flex gap-4 py-4 border-b border-gray-100 last:border-0">
      {item.product_image_url ? (
        <img
          src={item.product_image_url}
          alt={item.product_name}
          className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
        />
      ) : (
        <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center">
          <ImageOff className="w-6 h-6 text-gray-300" />
        </div>
      )}

      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 truncate">{item.product_name}</p>
        <p className="text-sm text-gray-500 mt-0.5">{formatPrice(item.unit_price_cents)} c/u</p>

        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
            className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
            aria-label="Disminuir cantidad"
          >
            −
          </button>
          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
          <button
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
            aria-label="Aumentar cantidad"
          >
            +
          </button>
        </div>
      </div>

      <div className="flex flex-col items-end justify-between">
        <p className="font-semibold text-gray-900">{formatPrice(item.subtotal_cents)}</p>
        <button
          onClick={() => removeItem(item.id)}
          className="text-sm text-red-500 hover:text-red-700 transition-colors"
          aria-label="Eliminar producto"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}
