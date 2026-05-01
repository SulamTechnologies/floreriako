import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/api/client";
import type { ProductWithCategoriesDTO, PaginatedResponse } from "@/types/api";

interface ProductsParams {
  category?: string;
  search?: string;
  page?: number;
  per_page?: number;
}

function buildProductsUrl(params: ProductsParams): string {
  const qs = new URLSearchParams();
  if (params.category) qs.set("category", params.category);
  if (params.search) qs.set("search", params.search);
  if (params.page) qs.set("page", String(params.page));
  if (params.per_page) qs.set("per_page", String(params.per_page));
  const query = qs.toString();
  return `/api/products${query ? `?${query}` : ""}`;
}

export function useProducts(params: ProductsParams = {}) {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => api.get<PaginatedResponse<ProductWithCategoriesDTO>>(buildProductsUrl(params)),
    staleTime: 1000 * 60 * 5,
  });
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ["products", slug],
    queryFn: () => api.get<ProductWithCategoriesDTO>(`/api/products/${slug}`),
    staleTime: 1000 * 60 * 5,
    enabled: Boolean(slug),
  });
}
