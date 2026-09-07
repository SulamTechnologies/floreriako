import { ChevronDown } from "lucide-react";
import { FAQS } from "@/config/landing";
import { Container, Section, SectionHeading } from "@/shared/ui/primitives";

/**
 * Preguntas frecuentes con `<details>` nativo.
 *
 * Deliberadamente sin estado de React: el contenido está en el HTML aunque no
 * cargue JS, que es justo lo que necesita el crawler para leer el `FAQPage`
 * del JSON-LD, y de paso el teclado y los lectores de pantalla lo manejan solos.
 */
export function Faq() {
  return (
    <Section id="faq" tone="sunken" className="border-y border-line">
      <Container size="narrow">
        <SectionHeading
          align="center"
          eyebrow="Dudas"
          title="Preguntas frecuentes"
          description="Lo que más nos preguntan antes de hacer el primer pedido."
        />

        <div className="mt-10 divide-y divide-line overflow-hidden rounded-card border border-line bg-surface-raised">
          {FAQS.map((faq) => (
            <details key={faq.question} className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-ink transition-colors hover:bg-brand-50/60 [&::-webkit-details-marker]:hidden">
                {faq.question}
                <ChevronDown
                  className="h-4 w-4 shrink-0 text-ink-muted transition-transform duration-200 group-open:rotate-180"
                  strokeWidth={2}
                />
              </summary>
              <p className="px-5 pb-5 text-sm leading-relaxed text-ink-soft">{faq.answer}</p>
            </details>
          ))}
        </div>
      </Container>
    </Section>
  );
}
