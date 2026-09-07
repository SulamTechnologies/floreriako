import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Topbar } from "./topbar";
import { Footer } from "./footer/Footer";
import { ScrollManager } from "./ScrollManager";
import { CartDrawer } from "@/features/cart/components/CartDrawer";
import { useCartSync } from "@/features/cart/useCartSync";

function CartSyncGate() {
  useCartSync();
  return null;
}

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

export function AppLayout() {
  const location = useLocation();

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <CartSyncGate />
      <ScrollManager />
      <Topbar />
      <main id="contenido" className="flex-1">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
}
