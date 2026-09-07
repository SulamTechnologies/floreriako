import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";
import { cn } from "@/shared/lib/cn";

type SearchFieldProps = {
  /** `inline` para la topbar (se expande al enfocar), `block` para el menú móvil */
  layout?: "inline" | "block";
  onSubmitted?: () => void;
  className?: string;
};

/**
 * Buscador de la topbar. Navega a /productos con el término aplicado, así el
 * resultado es una URL compartible e indexable.
 */
export function SearchField({ layout = "inline", onSubmitted, className }: SearchFieldProps) {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState("");
  const [expanded, setExpanded] = useState(layout === "block");

  const inline = layout === "inline";

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const term = value.trim().slice(0, 100);
    navigate(term ? `/productos?search=${encodeURIComponent(term)}` : "/productos");
    inputRef.current?.blur();
    if (inline) setExpanded(false);
    onSubmitted?.();
  }

  function open() {
    setExpanded(true);
    // El input aún no existe en el DOM al momento del click
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  if (inline && !expanded) {
    return (
      <button
        type="button"
        onClick={open}
        aria-label="Buscar flores"
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-brand-50 hover:text-ink-brand",
          className,
        )}
      >
        <Search className="h-5 w-5" strokeWidth={1.75} />
      </button>
    );
  }

  return (
    <form
      role="search"
      onSubmit={submit}
      className={cn("relative flex items-center", inline ? "w-56 lg:w-64" : "w-full", className)}
    >
      <Search
        className="pointer-events-none absolute left-3.5 h-4 w-4 text-ink-muted"
        strokeWidth={1.75}
      />
      <input
        ref={inputRef}
        type="search"
        name="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={() => {
          if (inline && !value) setExpanded(false);
        }}
        onKeyDown={(e) => {
          if (e.key === "Escape" && inline) {
            setValue("");
            setExpanded(false);
          }
        }}
        maxLength={100}
        placeholder="Buscar rosas, girasoles…"
        aria-label="Buscar productos"
        className="h-10 w-full rounded-pill border border-line-strong bg-surface-raised pl-10 pr-9 text-sm text-ink placeholder:text-ink-muted focus:border-brand-400 focus:outline-none focus-visible:outline-none"
      />
      {value ? (
        <button
          type="button"
          onClick={() => {
            setValue("");
            inputRef.current?.focus();
          }}
          aria-label="Limpiar búsqueda"
          className="absolute right-2.5 rounded-full p-1 text-ink-muted transition-colors hover:text-ink"
        >
          <X className="h-3.5 w-3.5" strokeWidth={2.5} />
        </button>
      ) : null}
    </form>
  );
}
