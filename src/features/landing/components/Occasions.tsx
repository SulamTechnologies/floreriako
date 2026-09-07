import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { OCCASIONS } from "@/config/catalog";
import { Container, Media, Section, SectionHeading } from "@/shared/ui/primitives";

/**
 * Ocasiones. No son categorías de base de datos, son la forma en que la gente
 * realmente busca flores ("es para un cumpleaños"), así que cada tarjeta lleva
 * a /productos con el filtro ya aplicado.
 */
export function Occasions() {
  return (
    <Section id="ocasiones">
      <Container>
        <SectionHeading
          eyebrow="Ocasiones"
          title="¿Para qué es el detalle?"
          description="Dinos el motivo y te mostramos solo lo que encaja."
        />

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {OCCASIONS.map((occasion, index) => (
            <motion.div
              key={occasion.key}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link
                to={occasion.href}
                className="group flex flex-col gap-3 rounded-card border border-line bg-surface-raised p-3 transition-all duration-300 hover:-translate-y-1 hover:border-line-brand hover:shadow-raised"
              >
                <Media
                  photo={occasion.photo}
                  alt=""
                  ratio="1/1"
                  seed={occasion.seed}
                  sizes="(max-width: 640px) 45vw, 220px"
                  className="rounded-xl"
                  imgClassName="transition-transform duration-500 group-hover:scale-105"
                />
                <span className="px-1 pb-1 text-sm font-semibold leading-snug text-ink group-hover:text-ink-brand">
                  {occasion.name}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
