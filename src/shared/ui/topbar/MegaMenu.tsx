import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { NavItem } from "@/config/navigation";
import { Media } from "@/shared/ui/primitives";

type MegaMenuProps = {
  panel: NonNullable<NavItem["panel"]>;
  onNavigate: () => void;
};

export function MegaMenu({ panel, onNavigate }: MegaMenuProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
      className="absolute left-1/2 top-full -translate-x-1/2 pt-2"
    >
      <div className="w-[min(46rem,calc(100vw-3rem))] overflow-hidden rounded-card border border-line bg-surface-raised shadow-float">
        <div className="grid gap-1 p-3 sm:grid-cols-[1.15fr_1fr]">
          <ul className="flex flex-col">
            {panel.items.map((item) => (
              <li key={item.label + item.href}>
                <Link
                  to={item.href}
                  onClick={onNavigate}
                  className="group flex flex-col gap-0.5 rounded-xl px-3 py-2.5 transition-colors hover:bg-brand-50"
                >
                  <span className="flex items-center gap-1.5 text-sm font-semibold text-ink group-hover:text-ink-brand">
                    {item.label}
                    <ArrowRight className="h-3.5 w-3.5 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                  </span>
                  {item.description ? (
                    <span className="text-xs leading-snug text-ink-muted">{item.description}</span>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>

          {panel.feature ? (
            <Link
              to={panel.feature.href}
              onClick={onNavigate}
              className="group relative flex min-h-52 flex-col justify-end overflow-hidden rounded-xl p-5 text-white"
            >
              <Media
                photo={panel.feature.photo}
                alt=""
                ratio="4/3"
                seed={panel.feature.seed}
                sizes="360px"
                className="absolute inset-0 h-full w-full"
                imgClassName="transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bone-900/85 via-bone-900/40 to-transparent" />
              <div className="relative">
                <span className="text-[0.625rem] font-semibold uppercase tracking-[0.18em] text-brand-200">
                  {panel.feature.eyebrow}
                </span>
                <p className="font-display mt-1 text-lg font-semibold leading-tight">
                  {panel.feature.title}
                </p>
                <p className="mt-1 text-xs leading-snug text-white/80">
                  {panel.feature.description}
                </p>
                <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-white">
                  {panel.feature.cta}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ) : null}
        </div>
      </div>
    </motion.div>
  );
}
