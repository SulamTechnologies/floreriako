/**
 * Catálogo de fotografía de la marca.
 *
 * Cada foto se exporta en dos anchos (640 y 1200) ya convertidos a WebP. El
 * componente `Media` arma el `srcSet` y el navegador baja solo el que necesita.
 *
 * El `alt` vive aquí y no en cada sección: describe la foto, no el hueco donde
 * se usa, así nunca queda un alt copiado que no corresponde a la imagen.
 */

import corazon1200 from "./arreglo-corazon-flores-1200.webp";
import corazon640 from "./arreglo-corazon-flores-640.webp";
import rosasRojas1200 from "./ramo-100-rosas-rojas-1200.webp";
import rosasRojas640 from "./ramo-100-rosas-rojas-640.webp";
import durazno1200 from "./ramo-durazno-crisantemos-1200.webp";
import durazno640 from "./ramo-durazno-crisantemos-640.webp";
import fucsia1200 from "./ramo-gerberas-fucsia-1200.webp";
import fucsia640 from "./ramo-gerberas-fucsia-640.webp";
import perlas1200 from "./ramo-gerberas-perlas-1200.webp";
import perlas640 from "./ramo-gerberas-perlas-640.webp";
import pastel1200 from "./ramo-pastel-blanco-1200.webp";
import pastel640 from "./ramo-pastel-blanco-640.webp";
import eucalipto1200 from "./ramo-rosas-rosa-eucalipto-1200.webp";
import eucalipto640 from "./ramo-rosas-rosa-eucalipto-640.webp";

export type Photo = {
  src: string;
  srcSet: string;
  alt: string;
};

function photo(small: string, large: string, alt: string): Photo {
  return { src: large, srcSet: `${small} 640w, ${large} 1200w`, alt };
}

export const PHOTOS = {
  gerberasFucsia: photo(
    fucsia640,
    fucsia1200,
    "Ramo de gerberas rosa fucsia y crisantemos morados envuelto en papel rosa",
  ),
  gerberasPerlas: photo(
    perlas640,
    perlas1200,
    "Ramo de gerberas rosa pastel con perlas y eucalipto",
  ),
  rosasRojas: photo(
    rosasRojas640,
    rosasRojas1200,
    "Ramo de cien rosas rojas con tiara y moño rosa, envuelto en papel negro y dorado",
  ),
  rosasEucalipto: photo(
    eucalipto640,
    eucalipto1200,
    "Ramo de rosas rosa claro con gerbera y eucalipto sobre papel blanco",
  ),
  pastelBlanco: photo(
    pastel640,
    pastel1200,
    "Ramo de crisantemos rosa pálido y rosas crema envuelto en papel blanco",
  ),
  duraznoCrisantemos: photo(
    durazno640,
    durazno1200,
    "Ramo de rosas durazno y crisantemos rosa listo para entrega",
  ),
  corazonFlores: photo(
    corazon640,
    corazon1200,
    "Arreglo en forma de corazón con gerberas, rosas y lilis sobre caja blanca",
  ),
} as const;

export type PhotoKey = keyof typeof PHOTOS;
