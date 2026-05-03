import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/features/cart/useCart";
import { CartItemRow } from "@/features/cart/components/CartItemRow";
import { formatPrice } from "@/shared/lib/format";
import { useAuthStore } from "@/store/auth";

export default function CartPage() {
  const { items, total_cents, item_count, isLoading } = useCart();
  const user = useAuthStore((s) => s.user);

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-24 bg-gray-100 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Tu carrito
        {item_count > 0 && (
          <span className="ml-2 text-base font-normal text-gray-500">
            ({item_count} {item_count === 1 ? "artículo" : "artículos"})
          </span>
        )}
      </h1>

      {items.length === 0 ? (
        <div className="flex flex-col items-center text-center py-16 gap-4">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
            <ShoppingBag className="w-7 h-7 text-gray-300" strokeWidth={1.5} />
          </div>
          <p className="text-gray-500">Tu carrito está vacío</p>
          <Link
            to="/productos"
            className="inline-block rounded-xl bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 transition-colors"
          >
            Ver productos
          </Link>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-2xl border border-gray-100 px-4 mb-6">
            {items.map((item) => (
              <CartItemRow key={item.id} item={item} />
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">{formatPrice(total_cents)}</span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-gray-600">Envío</span>
              <span className="text-sm text-gray-400">Calculado al pagar</span>
            </div>
            <div className="border-t border-gray-100 mt-3 pt-3 flex justify-between items-center">
              <span className="font-semibold text-gray-900">Total</span>
              <span className="font-bold text-xl text-gray-900">{formatPrice(total_cents)}</span>
            </div>
          </div>

          {user ? (
            <Link
              to="/checkout"
              className="block w-full rounded-xl bg-brand-600 px-6 py-3 text-base font-semibold text-white text-center hover:bg-brand-700 transition-colors"
            >
              Confirmar pedido
            </Link>
          ) : (
            <div className="space-y-3">
              <Link
                to="/login"
                className="block w-full rounded-xl bg-green-700 px-6 py-3 text-base font-semibold text-white text-center hover:bg-green-800 transition-colors"
              >
                Iniciar sesión para pagar
              </Link>
              <p className="text-center text-sm text-gray-400">
                ¿No tienes cuenta?{" "}
                <Link to="/registro" className="text-green-700 hover:underline">
                  Regístrate gratis
                </Link>
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
