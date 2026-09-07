import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * React Router en library mode no restaura scroll ni salta a anclas.
 *
 * - Sin hash: lleva la vista al inicio en cada cambio de ruta.
 * - Con hash (`/#faq`): hace scroll a la sección respetando la topbar fija
 *   (vía `scroll-padding-top` definido en index.css).
 */
export function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.slice(1);
      // La sección puede no estar montada todavía (páginas lazy)
      const raf = requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ block: "start" });
      });
      return () => cancelAnimationFrame(raf);
    }

    window.scrollTo({ top: 0, left: 0 });
    return undefined;
  }, [pathname, hash]);

  return null;
}
