import { CreditCard, MapPin, ShieldCheck } from "lucide-react";
import { PHOTOS } from "@/assets/photos";
import { business } from "@/config/business";
import { Container, Media, Section, SectionHeading, buttonStyles } from "@/shared/ui/primitives";

/**
 * Zonas de entrega y corte horario.
 *
 * Doble función: resuelve la duda de "¿llegan a mi colonia?" y aporta señales
 * de SEO local (nombres de ciudad en texto real, no en imagen).
 */
export function DeliveryZones() {
  return (
    <Section id="entregas">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Cobertura"
              title="Entregas a domicilio"
              description={`Llevamos tu pedido en ${business.deliveryAreaLabel}. Si tu dirección queda más lejos, mándanos la ubicación por WhatsApp y te confirmamos si llegamos y con qué costo de envío.`}
            />

            <ul className="mt-8 flex flex-wrap gap-2">
              {business.deliveryZones.map((zone) => (
                <li
                  key={zone}
                  className="flex items-center gap-1.5 rounded-pill border border-line-brand bg-brand-50 px-3.5 py-1.5 text-sm font-medium text-ink-brand"
                >
                  <MapPin className="h-3.5 w-3.5" strokeWidth={2} />
                  {zone}
                </li>
              ))}
            </ul>

            <dl className="mt-8 grid gap-5 sm:grid-cols-2">
              <div className="flex gap-3">
                <ShieldCheck
                  className="mt-0.5 h-5 w-5 shrink-0 text-brand-600"
                  strokeWidth={1.75}
                />
                <div>
                  <dt className="text-sm font-semibold text-ink">Garantía</dt>
                  <dd className="mt-0.5 text-sm text-ink-muted">
                    Si el arreglo se entrega en mal estado, te devolvemos tu dinero
                  </dd>
                </div>
              </div>
              <div className="flex gap-3">
                <CreditCard className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" strokeWidth={1.75} />
                <div>
                  <dt className="text-sm font-semibold text-ink">Pagos</dt>
                  <dd className="mt-0.5 text-sm text-ink-muted">
                    Tarjeta en línea, transferencia o efectivo
                  </dd>
                </div>
              </div>
            </dl>

            <a
              href={business.social.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonStyles("outline", "md", "mt-8")}
            >
              Consultar mi zona
            </a>
          </div>

          <Media
            photo={PHOTOS.duraznoCrisantemos}
            alt={PHOTOS.duraznoCrisantemos.alt}
            ratio="4/3"
            seed={4}
            sizes="(max-width: 1024px) 100vw, 560px"
            className="rounded-card shadow-raised"
          />
        </div>
      </Container>
    </Section>
  );
}
