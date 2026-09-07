import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useProducts } from "@/features/products/api";
import { ProductCard } from "@/features/products/components/ProductCard";
import { ProductSkeleton } from "@/features/products/components/ProductSkeleton";
import { Container, Section, SectionHeading, buttonStyles } from "@/shared/ui/primitives";

const COUNT = 4;

/**
 * Producto real del catálogo en el landing. Es el bloque que más pesa en
 * conversión: el usuario ve precio y disponibilidad sin salir de la home.
 *
 * Muestra los primeros productos que devuelve la API, no una curaduría: el
 * copy no promete una "selección de la semana" que nadie está armando.
 *
 * Si la API falla no mostramos un error en la landing, se oculta la sección
 * y el resto de la página sigue siendo útil.
 */
export function BestSellers() {
  const { data, isLoading, isError } = useProducts({ per_page: COUNT });
  const products = data?.data ?? [];

  if (isError || (!isLoading && products.length === 0)) return null;

  return (
    <Section>
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Disponibles"
            title="Lo que hay ahora en el catálogo"
            description="Precios en pesos mexicanos y pago seguro en línea."
          />
          <Link to="/productos" className={buttonStyles("secondary", "md", "group shrink-0")}>
            Ver todo el catálogo
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {isLoading
            ? Array.from({ length: COUNT }).map((_, i) => <ProductSkeleton key={i} />)
            : products.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
        </div>
      </Container>
    </Section>
  );
}
