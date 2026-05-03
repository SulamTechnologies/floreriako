import { Link, Outlet, useLocation, Navigate } from "react-router-dom";
import { Package, ShoppingBag, LogOut, Flower2 } from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { useProfile } from "@/features/orders/useProfile";
import { cn } from "@/shared/lib/cn";
import { useNavigate } from "react-router-dom";

const navLinks = [
  { to: "/admin/productos", label: "Productos", icon: Package },
  { to: "/admin/pedidos", label: "Pedidos", icon: ShoppingBag },
];

export default function AdminLayout() {
  const { user, signOut } = useAuthStore();
  const { data: profile, isLoading } = useProfile();
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) return <Navigate to="/login" replace />;
  if (!isLoading && profile?.role !== "admin") return <Navigate to="/" replace />;

  async function handleSignOut() {
    await signOut();
    navigate("/");
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-gray-100 flex flex-col shrink-0">
        <div className="px-5 py-5 border-b border-gray-100">
          <Link to="/" className="flex items-center gap-2">
            <Flower2 className="w-5 h-5 text-brand-600" strokeWidth={1.5} />
            <span className="font-bold text-gray-900 text-sm">
              Florería <span className="text-brand-600">KO</span>
            </span>
          </Link>
          <p className="text-xs text-gray-400 mt-1 ml-7">Panel de administración</p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navLinks.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors",
                location.pathname.startsWith(to)
                  ? "bg-brand-50 text-brand-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
              )}
            >
              <Icon className="w-4 h-4" strokeWidth={1.5} />
              {label}
            </Link>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-gray-100">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
