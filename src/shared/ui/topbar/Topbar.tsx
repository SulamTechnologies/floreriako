import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, LogOut, Menu, ShoppingBag, User, X } from "lucide-react";
import { MAIN_NAV } from "@/config/navigation";
import { useAuthStore } from "@/store/auth";
import { useCart } from "@/features/cart/useCart";
import { useUIStore } from "@/store/ui";
import { cn } from "@/shared/lib/cn";
import { Logo } from "@/shared/ui/brand/Logo";
import { buttonStyles } from "@/shared/ui/primitives";
import { AnnouncementBar } from "./AnnouncementBar";
import { MegaMenu } from "./MegaMenu";
import { MobileMenu } from "./MobileMenu";
import { SearchField } from "./SearchField";

export function Topbar() {
  const { user, signOut } = useAuthStore();
  const { item_count } = useCart();
  const { openCart } = useUIStore();
  const navigate = useNavigate();
  const location = useLocation();

  const headerRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [openPanel, setOpenPanel] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOffset, setMenuOffset] = useState("4rem");

  // Cerrar los paneles al cambiar de ruta. Se ajusta durante el render en vez
  // de en un efecto para no provocar un render en cascada.
  const routeKey = location.pathname + location.search;
  const [lastRouteKey, setLastRouteKey] = useState(routeKey);
  if (lastRouteKey !== routeKey) {
    setLastRouteKey(routeKey);
    setOpenPanel(null);
    setMobileOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Escape cierra el mega-menú y el menú móvil
  useEffect(() => {
    if (!openPanel && !mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpenPanel(null);
      setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openPanel, mobileOpen]);

  // Bloquear el scroll del body mientras el menú móvil está abierto
  useEffect(() => {
    if (!mobileOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mobileOpen]);

  const toggleMobile = useCallback(() => {
    setMobileOpen((open) => {
      if (!open && headerRef.current) {
        setMenuOffset(`${Math.round(headerRef.current.getBoundingClientRect().bottom)}px`);
      }
      return !open;
    });
  }, []);

  async function handleSignOut() {
    setMobileOpen(false);
    await signOut();
    navigate("/");
  }

  const isActive = (href: string) =>
    href.startsWith("/productos") && location.pathname.startsWith("/productos");

  const activePanel = MAIN_NAV.find((item) => item.label === openPanel)?.panel ?? null;

  return (
    <>
      <a href="#contenido" className="skip-link bg-brand-700 px-4 py-2 text-sm text-white">
        Saltar al contenido
      </a>

      <AnnouncementBar />

      <header
        ref={headerRef}
        className={cn(
          "sticky top-0 z-50 border-b transition-[background-color,border-color,box-shadow] duration-300",
          scrolled
            ? "border-line bg-surface-raised/95 shadow-soft backdrop-blur-md"
            : "border-transparent bg-surface/80 backdrop-blur-sm",
        )}
      >
        <div
          className="relative mx-auto flex h-topbar max-w-7xl items-center gap-4 px-5 sm:px-6 lg:px-8"
          onMouseLeave={() => setOpenPanel(null)}
        >
          <Link to="/" aria-label="Florería KO, inicio" className="shrink-0">
            <Logo />
          </Link>

          {/* Navegación de escritorio */}
          <nav
            aria-label="Navegación principal"
            className="hidden md:flex md:items-center md:gap-1"
          >
            {MAIN_NAV.map((item) =>
              item.panel ? (
                <div key={item.label} onMouseEnter={() => setOpenPanel(item.label)}>
                  <button
                    type="button"
                    aria-expanded={openPanel === item.label}
                    aria-haspopup="true"
                    onClick={() => setOpenPanel((p) => (p === item.label ? null : item.label))}
                    className={cn(
                      "flex items-center gap-1 rounded-pill px-3.5 py-2 text-sm font-medium transition-colors",
                      openPanel === item.label || isActive(item.href)
                        ? "bg-brand-50 text-ink-brand"
                        : "text-ink-soft hover:bg-brand-50 hover:text-ink-brand",
                    )}
                  >
                    {item.label}
                    <ChevronDown
                      className={cn(
                        "h-3.5 w-3.5 transition-transform duration-200",
                        openPanel === item.label && "rotate-180",
                      )}
                    />
                  </button>
                </div>
              ) : (
                <Link
                  key={item.label}
                  to={item.href}
                  onMouseEnter={() => setOpenPanel(null)}
                  className="rounded-pill px-3.5 py-2 text-sm font-medium text-ink-soft transition-colors hover:bg-brand-50 hover:text-ink-brand"
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>

          {/* Acciones */}
          <div className="ml-auto flex items-center gap-1">
            <SearchField className="hidden sm:flex" />

            <button
              type="button"
              onClick={openCart}
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-brand-50 hover:text-ink-brand"
              aria-label={`Abrir carrito${item_count > 0 ? ` (${item_count} artículos)` : ""}`}
            >
              <ShoppingBag className="h-5 w-5" strokeWidth={1.75} />
              <AnimatePresence>
                {item_count > 0 && (
                  <motion.span
                    key="badge"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="tabular absolute -right-0.5 -top-0.5 flex h-[1.125rem] min-w-[1.125rem] items-center justify-center rounded-full bg-brand-700 px-1 text-[10px] font-bold text-white"
                  >
                    {item_count > 99 ? "99+" : item_count}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {/* Cuenta, escritorio */}
            <div className="ml-1 hidden items-center gap-1.5 md:flex">
              {user ? (
                <>
                  <Link
                    to="/cuenta"
                    className="flex items-center gap-1.5 rounded-pill px-3 py-2 text-sm font-medium text-ink-soft transition-colors hover:bg-brand-50 hover:text-ink-brand"
                  >
                    <User className="h-4 w-4" strokeWidth={1.75} />
                    <span className="max-w-24 truncate">{user.email?.split("@")[0]}</span>
                  </Link>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    aria-label="Cerrar sesión"
                    className="flex h-10 w-10 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-danger-50 hover:text-danger-600"
                  >
                    <LogOut className="h-4 w-4" strokeWidth={1.75} />
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="rounded-pill px-3 py-2 text-sm font-medium text-ink-soft transition-colors hover:bg-brand-50 hover:text-ink-brand"
                  >
                    Iniciar sesión
                  </Link>
                  <Link to="/registro" className={buttonStyles("primary", "sm")}>
                    Registrarse
                  </Link>
                </>
              )}
            </div>

            {/* Botón de menú móvil */}
            <button
              type="button"
              onClick={toggleMobile}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
              className="flex h-10 w-10 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-brand-50 md:hidden"
            >
              {mobileOpen ? (
                <X className="h-5 w-5" strokeWidth={2} />
              ) : (
                <Menu className="h-5 w-5" strokeWidth={2} />
              )}
            </button>
          </div>

          {/* Mega-menú */}
          <AnimatePresence>
            {activePanel ? (
              <MegaMenu key={openPanel} panel={activePanel} onNavigate={() => setOpenPanel(null)} />
            ) : null}
          </AnimatePresence>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen ? (
          <div style={{ "--topbar-offset": menuOffset } as React.CSSProperties}>
            <MobileMenu
              userEmail={user?.email}
              onClose={() => setMobileOpen(false)}
              onSignOut={handleSignOut}
            >
              <SearchField layout="block" onSubmitted={() => setMobileOpen(false)} />
            </MobileMenu>
          </div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
