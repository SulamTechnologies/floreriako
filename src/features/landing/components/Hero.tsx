import { Link } from "react-router-dom";
import { motion, type Variants } from "framer-motion";
import { ArrowRight, Flower2, MessageCircle, ShieldCheck, Truck } from "lucide-react";
import { PHOTOS } from "@/assets/photos";
import { business } from "@/config/business";
import { OCCASIONS } from "@/config/catalog";
import { Container, Media, buttonStyles } from "@/shared/ui/primitives";

/**
 * Solo afirmaciones verificables: lo que la florería realmente hace. Nada de
 * garantías con plazos que el negocio no nos ha confirmado.
 */
const trustPoints = [
  { icon: Flower2, label: "Armado a mano por encargo" },
  { icon: Truck, label: `Entrega a domicilio en ${business.deliveryAreaLabel}` },
  { icon: ShieldCheck, label: "Garantía si llega en mal estado" },
];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
};

/**
 * Hero editorial: la promesa (flores frescas hoy) + prueba de que es creíble
 * (corte de entrega, garantía, zonas) + dos caminos de conversión (catálogo y
 * WhatsApp, que en florerías locales cierra más que el checkout).
 *
 * El collage usa `Media` con proporciones fijas: cuando lleguen las fotos
 * reales se pasan por `src` y el layout no se mueve.
 */
export function Hero() {
  return (
    <section className="relative overflow-hidden pb-16 pt-12 sm:pb-20 sm:pt-16 lg:pb-28 lg:pt-20">
      {/* Fondo decorativo */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-32 -top-48 h-[38rem] w-[38rem] rounded-full bg-brand-100/70 blur-[100px]" />
        <div className="absolute -bottom-40 -left-24 h-[26rem] w-[26rem] rounded-full bg-accent-100/50 blur-[90px]" />
      </div>

      <Container className="relative">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
          {/* Columna de texto */}
          <motion.div variants={container} initial="hidden" animate="show">
            <motion.div variants={fadeUp}>
              <span className="inline-flex items-center gap-2 rounded-pill border border-line-brand bg-brand-50 px-3 py-1.5 text-xs font-semibold text-ink-brand">
                <span className="inline-flex h-1.5 w-1.5 rounded-full bg-brand-600" />
                {business.tagline} · {business.address.city}, {business.address.state}
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="font-display mt-6 text-display-lg font-semibold tracking-tight text-ink text-balance"
            >
              Flores frescas
              <br />
              <span className="text-ink-brand">a domicilio</span>
              <br />
              en {business.address.city}
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-5 max-w-lg text-lg leading-relaxed text-ink-soft text-pretty"
            >
              Ramos y arreglos florales hechos a mano, desde $
              {business.priceRange.min.toLocaleString("es-MX")} MXN. Pide en línea o por WhatsApp y
              lo llevamos.
            </motion.p>

            <motion.div variants={fadeUp} className="mt-8 flex flex-wrap items-center gap-3">
              <Link to="/productos" className={buttonStyles("primary", "lg", "group")}>
                Ver el catálogo
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href={business.social.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonStyles("secondary", "lg")}
              >
                <MessageCircle className="h-4 w-4" />
                Pedir por WhatsApp
              </a>
            </motion.div>

            {/* Prueba de credibilidad */}
            <motion.ul
              variants={fadeUp}
              className="mt-10 flex flex-col gap-3 border-t border-line pt-6 sm:flex-row sm:flex-wrap sm:gap-x-7"
            >
              {trustPoints.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-2 text-sm text-ink-soft">
                  <Icon className="h-4 w-4 shrink-0 text-brand-600" strokeWidth={1.75} />
                  {label}
                </li>
              ))}
            </motion.ul>

            {/* Atajos por ocasión, reduce el "no sé qué buscar" */}
            <motion.div variants={fadeUp} className="mt-7">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-muted">
                Compra por ocasión
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {OCCASIONS.slice(0, 4).map((occasion) => (
                  <Link
                    key={occasion.key}
                    to={occasion.href}
                    className="rounded-pill border border-line-strong bg-surface-raised px-3.5 py-1.5 text-sm text-ink-soft transition-colors hover:border-brand-300 hover:text-ink-brand"
                  >
                    {occasion.name}
                  </Link>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Collage de imágenes */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            {/* Alto explícito: el collage no puede provocar CLS al cargar fotos */}
            <div className="grid h-[clamp(24rem,44vw,34rem)] grid-cols-5 gap-3 sm:gap-4">
              <Media
                photo={PHOTOS.gerberasPerlas}
                alt={PHOTOS.gerberasPerlas.alt}
                fill
                priority
                sizes="(max-width: 1024px) 60vw, 420px"
                className="col-span-3 rounded-card shadow-raised"
              />
              <div className="col-span-2 grid grid-rows-2 gap-3 sm:gap-4">
                <Media
                  photo={PHOTOS.rosasRojas}
                  alt={PHOTOS.rosasRojas.alt}
                  fill
                  sizes="(max-width: 1024px) 40vw, 280px"
                  className="rounded-card shadow-soft"
                />
                <Media
                  photo={PHOTOS.gerberasFucsia}
                  alt={PHOTOS.gerberasFucsia.alt}
                  fill
                  sizes="(max-width: 1024px) 40vw, 280px"
                  className="rounded-card shadow-soft"
                />
              </div>
            </div>

            {/* Sello flotante de entrega */}
            <div className="absolute -bottom-5 left-4 flex items-center gap-3 rounded-card border border-line bg-surface-raised/95 px-4 py-3 shadow-float backdrop-blur-sm sm:-bottom-6 sm:left-6">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-50">
                <Truck className="h-4.5 w-4.5 text-brand-700" strokeWidth={1.75} />
              </span>
              <span className="leading-tight">
                <span className="block text-sm font-semibold text-ink">Entrega a domicilio</span>
                <span className="block text-xs text-ink-muted">{business.deliveryAreaLabel}</span>
              </span>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
