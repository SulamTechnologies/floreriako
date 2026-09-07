import { motion } from "framer-motion";
import { STEPS } from "@/config/landing";
import { Container, Section, SectionHeading } from "@/shared/ui/primitives";

/**
 * Tres pasos del pedido. Responde la objeción principal de comprar flores en
 * línea: "¿cómo sé que va a llegar y cuándo?".
 */
export function HowItWorks() {
  return (
    <Section id="como-funciona" tone="brand" className="border-y border-line-brand">
      <Container>
        <SectionHeading
          align="center"
          eyebrow="Cómo funciona"
          title="Del taller a su puerta en tres pasos"
          description="Pides en línea y nosotros coordinamos el resto."
          className="mx-auto"
        />

        <ol className="mt-12 grid gap-8 md:grid-cols-3 md:gap-6">
          {STEPS.map((step, index) => (
            <motion.li
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex flex-col gap-3 md:px-2"
            >
              {/* Línea conectora entre pasos (solo escritorio) */}
              {index < STEPS.length - 1 ? (
                <span
                  aria-hidden
                  className="absolute left-12 top-5 hidden h-px w-[calc(100%-2rem)] bg-gradient-to-r from-brand-300 to-transparent md:block"
                />
              ) : null}

              <span className="font-display relative flex h-10 w-10 items-center justify-center rounded-full border border-brand-200 bg-surface-raised text-base font-semibold text-ink-brand shadow-soft">
                {index + 1}
              </span>
              <h3 className="text-base font-semibold text-ink">{step.title}</h3>
              <p className="text-sm leading-relaxed text-ink-soft">{step.description}</p>
            </motion.li>
          ))}
        </ol>
      </Container>
    </Section>
  );
}
