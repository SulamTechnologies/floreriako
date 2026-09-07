import {
  BestSellers,
  CategoryShowcase,
  ContactCta,
  DeliveryZones,
  Faq,
  Gallery,
  Hero,
  HowItWorks,
  Occasions,
} from "@/features/landing/components";
import { JsonLd, Seo, faqSchema, floristSchema, websiteSchema } from "@/shared/seo";
import { business } from "@/config/business";

/**
 * Landing. El orden de las secciones sigue el recorrido de decisión:
 * promesa → qué venden → producto real → cómo funciona → para qué ocasión →
 * trabajo real → llegan a mi zona → dudas → contacto.
 */
export default function HomePage() {
  return (
    <>
      <Seo
        title={`Florería en ${business.address.city}, flores frescas a domicilio`}
        description={`Ramos y arreglos florales hechos a mano en ${business.address.city}, Sinaloa. Entrega a domicilio en ${business.deliveryAreaLabel}. Desde $${business.priceRange.min} MXN.`}
        path="/"
      />
      <JsonLd data={[floristSchema(), websiteSchema(), faqSchema()]} />

      <Hero />
      <CategoryShowcase />
      <BestSellers />
      <HowItWorks />
      <Occasions />
      <Gallery />
      <DeliveryZones />
      <Faq />
      <ContactCta />
    </>
  );
}
