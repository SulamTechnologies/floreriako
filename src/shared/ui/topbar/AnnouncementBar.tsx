import { useState } from "react";
import { Truck, X } from "lucide-react";
import { business } from "@/config/business";

const STORAGE_KEY = "ko.announce.dismissed.v1";

function readDismissed() {
  try {
    return localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    // Modo privado, storage bloqueado o prerender en Node: mostrar el aviso
    return false;
  }
}

/**
 * Barra superior de aviso. Comunica la cobertura de entrega, que es la primera
 * duda de quien entra a una florería en línea.
 * Se puede cerrar y la decisión se recuerda en localStorage.
 */
export function AnnouncementBar() {
  const [visible, setVisible] = useState(() => !readDismissed());

  function dismiss() {
    setVisible(false);
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // Sin persistencia: se volverá a mostrar en la siguiente visita
    }
  }

  if (!visible) return null;

  return (
    <div className="relative bg-bone-900 text-bone-100">
      <div className="mx-auto flex h-announce max-w-7xl items-center justify-center gap-2 px-10 text-center text-xs sm:text-[0.8125rem]">
        <Truck className="hidden h-3.5 w-3.5 shrink-0 text-brand-300 sm:block" strokeWidth={2} />
        <p className="truncate">
          <strong className="font-semibold">Entrega a domicilio</strong> en{" "}
          {business.deliveryAreaLabel}
        </p>
        <a
          href={business.social.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden shrink-0 font-semibold text-brand-200 underline decoration-brand-600 underline-offset-2 transition-colors hover:text-white sm:inline"
        >
          Pedir por WhatsApp
        </a>
      </div>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Cerrar aviso"
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-bone-400 transition-colors hover:bg-white/10 hover:text-white"
      >
        <X className="h-3.5 w-3.5" strokeWidth={2.5} />
      </button>
    </div>
  );
}
