import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { PHOTOS } from "@/assets/photos";
import { business } from "@/config/business";
import { Container, Media, Section, SectionHeading, buttonStyles } from "@/shared/ui/primitives";
import { InstagramIcon } from "@/shared/ui/brand/SocialIcons";

/**
 * Trabajo real del taller.
 *
 * Ocupa el lugar donde normalmente iría prueba social. Se optó por fotografía
 * propia y no por testimonios: la florería aún no nos ha dado reseñas reales, y
 * publicar reseñas inventadas en el sitio de un negocio real no es una opción.
 * Cuando lleguen reseñas verificables se puede añadir una sección aparte.
 */

const GALLERY = [
  PHOTOS.gerberasFucsia,
  PHOTOS.rosasRojas,
  PHOTOS.corazonFlores,
  PHOTOS.pastelBlanco,
  PHOTOS.rosasEucalipto,
  PHOTOS.duraznoCrisantemos,
] as const;

export function Gallery() {
  return (
    <Section id="galeria" tone="raised" className="border-y border-line">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Nuestro trabajo"
            title="Cada arreglo, armado a mano"
            description="Fotos reales de pedidos que han salido del taller."
          />
          {business.social.instagram ? (
            <a
              href={business.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonStyles("secondary", "md", "group shrink-0")}
            >
              <InstagramIcon className="h-4 w-4" />
              Ver más en Instagram
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          ) : null}
        </div>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
          {GALLERY.map((photo, index) => (
            <motion.figure
              key={photo.src}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: (index % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="m-0 overflow-hidden rounded-card"
            >
              <Media
                photo={photo}
                alt={photo.alt}
                ratio="4/5"
                sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 360px"
                imgClassName="transition-transform duration-700 hover:scale-105"
              />
            </motion.figure>
          ))}
        </div>
      </Container>
    </Section>
  );
}
