import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronDown, LogOut, MessageCircle, Phone, User } from "lucide-react";
import { business } from "@/config/business";
import { MAIN_NAV } from "@/config/navigation";
import { cn } from "@/shared/lib/cn";
import { buttonStyles } from "@/shared/ui/primitives";

type MobileMenuProps = {
  userEmail?: string | null;
  onClose: () => void;
  onSignOut: () => void;
  children?: React.ReactNode;
};

/**
 * Menú móvil a pantalla completa. Acordeón por sección para que el catálogo
 * completo quepa sin scroll infinito, y CTA de contacto siempre visible al pie.
 */
export function MobileMenu({ userEmail, onClose, onSignOut, children }: MobileMenuProps) {
  const [openSection, setOpenSection] = useState<string | null>("Tienda");

  return (
    <motion.div
      id="mobile-menu"
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 bottom-0 top-[var(--topbar-offset,4rem)] z-40 flex flex-col overflow-y-auto bg-surface-raised md:hidden"
    >
      <div className="border-b border-line px-5 py-4">{children}</div>

      <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
        {MAIN_NAV.map((item) =>
          item.panel ? (
            <div key={item.label} className="border-b border-line/70 last:border-0">
              <button
                type="button"
                onClick={() => setOpenSection((s) => (s === item.label ? null : item.label))}
                aria-expanded={openSection === item.label}
                className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-base font-semibold text-ink"
              >
                {item.label}
                <ChevronDown
                  className={cn(
                    "h-4 w-4 text-ink-muted transition-transform duration-200",
                    openSection === item.label && "rotate-180",
                  )}
                />
              </button>
              {openSection === item.label ? (
                <ul className="pb-2">
                  {item.panel.items.map((sub) => (
                    <li key={sub.href + sub.label}>
                      <Link
                        to={sub.href}
                        onClick={onClose}
                        className="block rounded-xl px-6 py-2.5 text-sm text-ink-soft transition-colors hover:bg-brand-50 hover:text-ink-brand"
                      >
                        {sub.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          ) : (
            <Link
              key={item.label}
              to={item.href}
              onClick={onClose}
              className="rounded-xl px-3 py-3 text-base font-semibold text-ink transition-colors hover:bg-brand-50"
            >
              {item.label}
            </Link>
          ),
        )}
      </nav>

      <div className="mt-auto flex flex-col gap-3 border-t border-line bg-surface-sunken px-5 py-5">
        {userEmail ? (
          <div className="flex items-center gap-2">
            <Link
              to="/cuenta"
              onClick={onClose}
              className={buttonStyles("secondary", "md", "flex-1")}
            >
              <User className="h-4 w-4" /> Mi cuenta
            </Link>
            <button
              type="button"
              onClick={onSignOut}
              className={buttonStyles("ghost", "md", "text-danger-600 hover:bg-danger-50")}
            >
              <LogOut className="h-4 w-4" /> Salir
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              onClick={onClose}
              className={buttonStyles("secondary", "md", "flex-1")}
            >
              Iniciar sesión
            </Link>
            <Link
              to="/registro"
              onClick={onClose}
              className={buttonStyles("primary", "md", "flex-1")}
            >
              Registrarse
            </Link>
          </div>
        )}

        <div className="flex items-center gap-2">
          <a
            href={business.social.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonStyles("outline", "md", "flex-1")}
          >
            <MessageCircle className="h-4 w-4" /> WhatsApp
          </a>
          <a
            href={`tel:${business.contact.phone}`}
            className={buttonStyles("ghost", "md", "flex-1")}
          >
            <Phone className="h-4 w-4" /> Llamar
          </a>
        </div>
      </div>
    </motion.div>
  );
}
