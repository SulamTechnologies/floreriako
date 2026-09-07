import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Clock, MapPin, MessageCircle, Phone } from "lucide-react";
import { business } from "@/config/business";
import { Container, Section, buttonStyles } from "@/shared/ui/primitives";

/**
 * Cierre del landing: última llamada a la acción con los dos canales que de
 * verdad usa un cliente local, WhatsApp y teléfono, más la dirección y el
 * horario en texto, que es lo que lee Google para el panel de negocio local.
 */
export function ContactCta() {
  const { contact, hoursDisplay } = business;

  return (
    <Section id="contacto" tone="inverse" spacing="lg" className="overflow-hidden">
      {/* Textura de fondo */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -right-20 top-0 h-96 w-96 rounded-full bg-brand-700/30 blur-[100px]" />
        <div className="absolute -bottom-24 left-10 h-72 w-72 rounded-full bg-accent-600/18 blur-[90px]" />
      </div>

      <Container className="relative">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-300">
              Hablemos
            </span>
            <h2 className="font-display mt-3 text-display font-semibold text-balance text-white">
              ¿No sabes qué mandar?
            </h2>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-white/80 text-pretty">
              Cuéntanos la ocasión y el presupuesto. Te mandamos fotos de dos o tres opciones y lo
              armamos igual el mismo día.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href={business.social.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonStyles("inverse", "lg")}
              >
                <MessageCircle className="h-4 w-4" />
                Escribir por WhatsApp
              </a>
              <a
                href={`tel:${contact.phone}`}
                className={buttonStyles(
                  "ghost",
                  "lg",
                  "text-white hover:bg-white/10 hover:text-white",
                )}
              >
                <Phone className="h-4 w-4" />
                {contact.phoneDisplay}
              </a>
            </div>

            <Link
              to="/productos"
              className="group mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-300 transition-colors hover:text-white"
            >
              O explora el catálogo por tu cuenta
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>

          {/* Cobertura y horario en texto, señal de negocio local para Google.
              No se publica la calle: no hay tienda abierta al público. */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="grid gap-6 rounded-card border border-white/10 bg-white/5 p-6 backdrop-blur-sm sm:grid-cols-2 lg:grid-cols-1"
          >
            <div className="flex gap-3">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-brand-300" strokeWidth={1.75} />
              <div>
                <p className="text-sm font-semibold text-white">Dónde entregamos</p>
                <p className="mt-1 text-sm leading-relaxed text-white/75">
                  {business.deliveryAreaLabel}
                  <br />
                  Servicio a domicilio, sin tienda física
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Clock className="mt-0.5 h-5 w-5 shrink-0 text-brand-300" strokeWidth={1.75} />
              <div>
                <p className="text-sm font-semibold text-white">Horario</p>
                <dl className="mt-1 space-y-0.5 text-sm text-white/75">
                  {hoursDisplay.map((entry) => (
                    <div key={entry.label} className="flex gap-2">
                      <dt>{entry.label}:</dt>
                      <dd className="tabular">{entry.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </Section>
  );
}
