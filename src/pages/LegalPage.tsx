import { Container, Section } from "@/shared/ui/primitives";
import { business } from "@/config/business";
import { Seo } from "@/shared/seo";

/**
 * Páginas legales.
 *
 * IMPORTANTE: el texto de abajo es un ESQUELETO, no un documento legal
 * revisado. Stripe y la LFPDPPP exigen aviso de privacidad y términos
 * publicados; hay que reemplazar este contenido por el redactado real antes
 * de abrir la tienda al público.
 */

type LegalSection = { heading: string; body: string };

type LegalDoc = { title: string; intro: string; sections: LegalSection[] };

const DOCS: Record<"privacidad" | "terminos", LegalDoc> = {
  privacidad: {
    title: "Aviso de privacidad",
    intro: `${business.legalName}, con domicilio fiscal en ${business.address.city}, ${business.address.state}, es responsable del tratamiento de los datos personales que nos proporcionas al comprar en este sitio.`,
    sections: [
      {
        heading: "Datos que recabamos",
        body: "Nombre, teléfono, correo electrónico y dirección de entrega. Los datos de pago los procesa directamente nuestro proveedor de pagos; no almacenamos números de tarjeta en nuestros servidores.",
      },
      {
        heading: "Para qué los usamos",
        body: "Procesar y entregar tu pedido, contactarte sobre el estado de la entrega, emitir comprobantes y atender aclaraciones. No vendemos ni compartimos tus datos con terceros ajenos a la operación del pedido.",
      },
      {
        heading: "Derechos ARCO",
        body: `Puedes solicitar el acceso, rectificación, cancelación u oposición al tratamiento de tus datos contactándonos al ${business.contact.phoneDisplay}${business.contact.email ? ` o a ${business.contact.email}` : ""}.`,
      },
      {
        heading: "Cambios a este aviso",
        body: "Cualquier modificación se publicará en esta misma página con su fecha de actualización.",
      },
    ],
  },
  terminos: {
    title: "Términos y condiciones",
    intro: `Al realizar un pedido en ${business.legalName} aceptas las condiciones descritas en esta página.`,
    sections: [
      {
        heading: "Pedidos y disponibilidad",
        body: "Las flores son producto perecedero y sujeto a temporada. Todos los arreglos se hacen por encargo. Si una variedad no está disponible, te avisamos antes de la entrega para acordar una sustitución de valor y estilo equivalentes.",
      },
      {
        heading: "Precios y pagos",
        body: `Los precios están en pesos mexicanos (${business.currency}) y van de $${business.priceRange.min.toLocaleString("es-MX")} a $${business.priceRange.max.toLocaleString("es-MX")} según el arreglo. Aceptamos ${business.paymentMethods.join(", ").toLowerCase()}; el pago con tarjeta se procesa en línea al confirmar el pedido.`,
      },
      {
        heading: "Entregas",
        body: `Entregamos a domicilio en ${business.deliveryAreaLabel}. No contamos con tienda física abierta al público. Si nadie recibe en el domicilio indicado, contactamos al comprador para coordinar un nuevo intento; las condiciones de ese segundo envío se acuerdan por WhatsApp.`,
      },
      {
        heading: "Garantía y devoluciones",
        body: "Si el producto se entrega en mal estado, envíanos una foto por WhatsApp lo antes posible y procedemos con la devolución del importe.",
      },
    ],
  },
};

export default function LegalPage({ doc }: { doc: keyof typeof DOCS }) {
  const content = DOCS[doc];

  return (
    <Section>
      <Seo title={content.title} description={content.intro.slice(0, 155)} path={`/legal/${doc}`} />
      <Container size="prose">
        <h1 className="font-display text-display-sm font-semibold text-ink">{content.title}</h1>
        <p className="mt-4 text-base leading-relaxed text-ink-soft">{content.intro}</p>

        <div className="mt-10 flex flex-col gap-8">
          {content.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-base font-semibold text-ink">{section.heading}</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{section.body}</p>
            </section>
          ))}
        </div>

        <p className="mt-12 rounded-card border border-line bg-surface-sunken p-4 text-xs leading-relaxed text-ink-muted">
          Documento pendiente de revisión legal. Reemplazar por la versión definitiva antes de
          operar con clientes reales.
        </p>
      </Container>
    </Section>
  );
}
