import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, User, LogOut, Flower2, Menu, X } from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { useCart } from "@/features/cart/useCart";
import { useUIStore } from "@/store/ui";
import { cn } from "@/shared/lib/cn";

export function Navbar() {
  const { user, signOut } = useAuthStore();
  const { item_count } = useCart();
  const { openCart } = useUIStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setMobileOpen(false), 0);
    return () => clearTimeout(t);
  }, [location.pathname]);

  async function handleSignOut() {
    await signOut();
    navigate("/");
  }

  const navLinks = [{ to: "/productos", label: "Productos" }];

  return (
    <>
      <motion.header
        className={cn(
          "fixed top-0 inset-x-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-white/90 backdrop-blur-md border-b border-gray-100/80 shadow-sm"
            : "bg-transparent",
        )}
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ rotate: 15, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Flower2 className="w-6 h-6 text-brand-600" strokeWidth={1.5} />
            </motion.div>
            <span className="text-lg font-bold text-gray-900 tracking-tight">
              Florería <span className="text-brand-600">KO</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  "text-sm font-medium transition-colors relative group",
                  location.pathname.startsWith(link.to)
                    ? "text-brand-700"
                    : "text-gray-600 hover:text-gray-900",
                )}
              >
                {link.label}
                <span
                  className={cn(
                    "absolute -bottom-0.5 left-0 h-0.5 bg-brand-600 transition-all duration-300",
                    location.pathname.startsWith(link.to) ? "w-full" : "w-0 group-hover:w-full",
                  )}
                />
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-1">
            {/* Cart button */}
            <motion.button
              onClick={openCart}
              className="relative flex items-center justify-center w-10 h-10 rounded-full text-gray-600 hover:text-brand-700 hover:bg-brand-50 transition-colors"
              whileTap={{ scale: 0.9 }}
              aria-label="Abrir carrito"
            >
              <ShoppingBag className="w-5 h-5" strokeWidth={1.5} />
              <AnimatePresence>
                {item_count > 0 && (
                  <motion.span
                    key="badge"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="absolute -top-0.5 -right-0.5 w-4 h-4 flex items-center justify-center rounded-full bg-brand-600 text-white text-[10px] font-bold"
                  >
                    {item_count > 99 ? "99" : item_count}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Auth desktop */}
            <div className="hidden md:flex items-center gap-2 ml-2">
              {user ? (
                <>
                  <Link
                    to="/cuenta"
                    className="flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-brand-700 transition-colors px-2 py-1.5 rounded-lg hover:bg-brand-50"
                  >
                    <User className="w-4 h-4" />
                    <span className="truncate max-w-28">{user.email?.split("@")[0]}</span>
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-600 transition-colors px-2 py-1.5 rounded-lg hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4" />
                    Salir
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-100"
                  >
                    Iniciar sesión
                  </Link>
                  <Link
                    to="/registro"
                    className="text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 transition-colors px-4 py-2 rounded-xl"
                  >
                    Registrarse
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-full text-gray-600 hover:bg-gray-100 transition-colors ml-1"
              aria-label="Menú"
            >
              <AnimatePresence mode="wait">
                {mobileOpen ? (
                  <motion.span
                    key="x"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <X className="w-5 h-5" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Menu className="w-5 h-5" />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="md:hidden overflow-hidden bg-white/95 backdrop-blur-md border-t border-gray-100"
            >
              <nav className="flex flex-col gap-1 p-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-brand-50 hover:text-brand-700 transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="border-t border-gray-100 mt-2 pt-2">
                  {user ? (
                    <>
                      <Link
                        to="/cuenta"
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-brand-50"
                      >
                        <User className="w-4 h-4" /> Mi cuenta
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-2 w-full text-left px-4 py-2.5 rounded-xl text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="w-4 h-4" /> Cerrar sesión
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        className="block px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100"
                      >
                        Iniciar sesión
                      </Link>
                      <Link
                        to="/registro"
                        className="block mt-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-brand-600 text-center hover:bg-brand-700"
                      >
                        Registrarse
                      </Link>
                    </>
                  )}
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Spacer */}
      <div className="h-16" />
    </>
  );
}
