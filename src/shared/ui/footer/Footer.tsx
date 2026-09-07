import { Link } from "react-router-dom";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { business } from "@/config/business";
import { FOOTER_NAV } from "@/config/navigation";
import { Container } from "@/shared/ui/primitives";
import { Logo } from "@/shared/ui/brand/Logo";
import { FacebookIcon, InstagramIcon, TiktokIcon } from "@/shared/ui/brand/SocialIcons";

const PAYMENT_METHODS = ["Visa", "Mastercard", "AmEx", "Stripe"];

const LEGAL_LINKS = [
  { label: "Aviso de privacidad", href: "/legal/privacidad" },
  { label: "Términos y condiciones", href: "/legal/terminos" },
  { label: "Política de envíos", href: "/#entregas" },
];

/**
 * Pie de página.
 *
 * Va en tono claro a propósito: la sección de contacto que lo precede es
 * oscura, y dos bloques oscuros seguidos borran el cierre de la página.
 *
 * Además del árbol de navegación, repite el NAP completo (nombre, dirección,
 * teléfono) en texto plano, es la señal que Google cruza con Google Business
 * Profile para el posicionamiento local.
 */
export function Footer() {
  const { contact, hoursDisplay, social } = business;
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-surface-sunken">
      <Container className="py-14 lg:py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_2.4fr]">
          {/* Marca y contacto directo */}
          <div>
            <Link to="/" aria-label="Florería KO, inicio" className="inline-block">
              <Logo />
            </Link>

            <p className="mt-5 max-w-xs text-sm leading-relaxed text-ink-soft">
              {business.description}
            </p>

            <div className="mt-6 flex flex-col gap-2.5 text-sm">
              <a
                href={social.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-semibold text-ink-brand transition-colors hover:text-brand-800"
              >
                <MessageCircle className="h-4 w-4" strokeWidth={1.75} />
                Pedir por WhatsApp
              </a>
              <a
                href={`tel:${contact.phone}`}
                className="inline-flex items-center gap-2 text-ink-soft transition-colors hover:text-ink-brand"
              >
                <Phone className="h-4 w-4" strokeWidth={1.75} />
                <span className="tabular">{contact.phoneDisplay}</span>
              </a>
              {contact.email ? (
                <a
                  href={`mailto:${contact.email}`}
                  className="inline-flex items-center gap-2 text-ink-soft transition-colors hover:text-ink-brand"
                >
                  <Mail className="h-4 w-4" strokeWidth={1.75} />
                  {contact.email}
                </a>
              ) : null}
            </div>

            <div className="mt-6 flex items-center gap-2">
              {social.instagram ? (
                <a
                  href={social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram de Florería KO"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-line-strong bg-surface-raised text-ink-soft transition-colors hover:border-brand-300 hover:text-ink-brand"
                >
                  <InstagramIcon className="h-4 w-4" />
                </a>
              ) : null}
              {social.tiktok ? (
                <a
                  href={social.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok de Florería KO"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-line-strong bg-surface-raised text-ink-soft transition-colors hover:border-brand-300 hover:text-ink-brand"
                >
                  <TiktokIcon className="h-4 w-4" />
                </a>
              ) : null}
              {social.facebook ? (
                <a
                  href={social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook de Florería KO"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-line-strong bg-surface-raised text-ink-soft transition-colors hover:border-brand-300 hover:text-ink-brand"
                >
                  <FacebookIcon className="h-4 w-4" />
                </a>
              ) : null}
            </div>
          </div>

          {/* Árbol de navegación + datos del local */}
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {FOOTER_NAV.map((column) => (
              <nav key={column.title} aria-label={column.title}>
                <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-muted">
                  {column.title}
                </h2>
                <ul className="mt-4 flex flex-col gap-2.5">
                  {column.links.map((link) => (
                    <li key={link.href + link.label}>
                      <Link
                        to={link.href}
                        className="text-sm text-ink-soft transition-colors hover:text-ink-brand"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}

            <div>
              <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-muted">
                Entregas
              </h2>
              <div className="mt-4 flex flex-col gap-4 text-sm">
                <div className="flex gap-2">
                  <MapPin
                    className="mt-0.5 h-4 w-4 shrink-0 text-brand-600"
                    strokeWidth={1.75}
                    aria-hidden
                  />
                  {/* Servicio a domicilio: se nombra la zona, no la calle */}
                  <p className="leading-relaxed text-ink-soft">
                    {business.deliveryAreaLabel}
                    <br />
                    <span className="text-ink-muted">Servicio a domicilio</span>
                  </p>
                </div>
                <div className="flex gap-2">
                  <Clock
                    className="mt-0.5 h-4 w-4 shrink-0 text-brand-600"
                    strokeWidth={1.75}
                    aria-hidden
                  />
                  <dl className="space-y-1 text-ink-soft">
                    {hoursDisplay.map((entry) => (
                      <div key={entry.label}>
                        <dt className="text-xs text-ink-muted">{entry.label}</dt>
                        <dd className="tabular">{entry.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* Franja legal */}
      <div className="border-t border-line">
        <Container className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-ink-muted">
            © {year} {business.legalName}. Todos los derechos reservados.
          </p>

          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {LEGAL_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  to={link.href}
                  className="text-xs text-ink-muted transition-colors hover:text-ink-brand"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <span className="sr-only">Métodos de pago aceptados</span>
            {PAYMENT_METHODS.map((method) => (
              <span
                key={method}
                className="rounded-md border border-line-strong bg-surface-raised px-2 py-1 text-[0.625rem] font-semibold uppercase tracking-wide text-ink-muted"
              >
                {method}
              </span>
            ))}
          </div>
        </Container>
      </div>
    </footer>
  );
}
