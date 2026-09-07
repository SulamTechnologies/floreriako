import { business } from "./business";

/**
 * Contenido editorial del landing.
 *
 * Vive en config y no dentro de los componentes porque el SEO lo reutiliza:
 * las FAQ alimentan el JSON-LD de `FAQPage`. Un solo texto, dos consumidores —
 * nunca se desincronizan.
 *
 * REGLA: aquí no se inventan políticas del negocio. Solo entra lo que la
 * florería confirmó; lo que no, remite a WhatsApp.
 */

export type Step = { title: string; description: string };

export const STEPS: Step[] = [
  {
    title: "Elige tu arreglo",
    description:
      "Explora el catálogo por tipo u ocasión. Cada arreglo muestra qué flores lleva y su precio.",
  },
  {
    title: "Dinos cuándo y dónde",
    description:
      "Indicas fecha, dirección y dedicatoria al hacer el pedido. Te confirmamos la entrega por WhatsApp.",
  },
  {
    title: "Lo armamos y lo llevamos",
    description:
      "Cada arreglo se monta a mano por encargo y lo entregamos a domicilio en la zona de cobertura.",
  },
];

export type FaqItem = { question: string; answer: string };

const priceRange = `$${business.priceRange.min.toLocaleString("es-MX")} y $${business.priceRange.max.toLocaleString("es-MX")} MXN`;

export const FAQS: FaqItem[] = [
  {
    question: "¿Cuánto cuesta un arreglo?",
    answer: `Los arreglos van de ${priceRange}, según el tamaño y el tipo de flor. Cada producto del catálogo muestra su precio final.`,
  },
  {
    question: "¿A qué zonas entregan?",
    answer: `Entregamos a domicilio en ${business.deliveryAreaLabel}. Si tu dirección queda más lejos, mándanos la ubicación por WhatsApp y te confirmamos si llegamos y con qué costo de envío.`,
  },
  {
    question: "¿Qué formas de pago aceptan?",
    answer: `Aceptamos ${business.paymentMethods.join(", ").toLowerCase()}. El pago con tarjeta se hace al terminar el pedido en el sitio; para transferencia o efectivo, escríbenos por WhatsApp.`,
  },
  {
    question: "¿Puedo enviar una dedicatoria?",
    answer:
      "Sí, sin costo extra. Al hacer el pedido nos dices qué quieres que diga la tarjeta y si el destinatario debe saber de parte de quién va.",
  },
  {
    question: "¿Qué pasa si el arreglo llega en mal estado?",
    answer:
      "Tenemos garantía: si el producto se entregó en mal estado, mándanos una foto por WhatsApp y te hacemos la devolución.",
  },
  {
    question: "¿Puedo pedir un arreglo distinto a los del catálogo?",
    answer:
      "Sí. Dinos la ocasión, los colores y tu presupuesto, y te mandamos fotos de opciones antes de armarlo. Todo se hace a mano, así que se puede ajustar.",
  },
  {
    question: "¿Hacen arreglos para bodas, XV años y eventos?",
    answer:
      "Sí. Mándanos la fecha, el lugar y una idea de lo que buscas para armarte una propuesta.",
  },
  {
    question: "¿Cómo cuido las flores para que duren más?",
    answer:
      "Mantenlas fuera del sol directo y lejos de corrientes de aire, cámbiales el agua cada dos días y recorta un centímetro del tallo en diagonal al cambiarla.",
  },
];
