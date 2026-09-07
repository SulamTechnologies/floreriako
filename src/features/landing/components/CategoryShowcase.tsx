import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { CATEGORIES } from "@/config/catalog";
import { Container, Media, Section, SectionHeading } from "@/shared/ui/primitives";

/**
 * Categorías del catálogo. Es la primera bifurcación real del landing: en una
 * florería la intención de compra suele estar clara (ramo vs arreglo vs planta),
 * así que conviene resolverla antes de mostrar producto individual.
 *
 * La primera categoría ocupa el doble de espacio para romper la monotonía de
 * una rejilla plana de cinco tarjetas iguales.
 */
export function CategoryShowcase() {
  return (
    <Section tone="raised" className="border-y border-line">
      <Container>
        <SectionHeading
          eyebrow="Catálogo"
          title="Qué estás buscando"
          description="Cada familia de arreglos, hecha a mano por encargo."
        />

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((category, index) => (
            <motion.div
              key={category.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
              className={index === 0 ? "sm:col-span-2 lg:row-span-2" : undefined}
            >
              <Link
                to={`/productos?category=${category.slug}`}
                className="group relative flex h-full min-h-56 flex-col justify-end overflow-hidden rounded-card p-5 text-white"
              >
                {category.photo ? (
                  <Media
                    photo={category.photo}
                    alt=""
                    fill
                    seed={category.seed}
                    className="absolute inset-0"
                    imgClassName="transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  /* Sin foto todavía: un panel de marca se lee como decisión,
                     un placeholder ilustrado al lado de fotos reales no. */
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-br from-accent-300 via-accent-200 to-bone-300"
                  />
                )}
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-bone-900/85 via-bone-900/35 to-transparent transition-opacity duration-300 group-hover:from-bone-900/90"
                />
                <div className="relative flex items-end justify-between gap-3">
                  <div>
                    <h3 className="font-display text-xl font-semibold leading-tight">
                      {category.name}
                    </h3>
                    <p className="mt-1 max-w-xs text-sm leading-snug text-white/85">
                      {category.description}
                    </p>
                  </div>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm transition-all duration-300 group-hover:bg-white group-hover:text-brand-800">
                    <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
