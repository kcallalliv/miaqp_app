import type { Product } from "./types";
import { PRODUCTS } from "./products";
import { isMedusaEnabled, medusaFetch, MEDUSA_REGION_ID } from "./medusa/client";
import { mapMedusaProduct } from "./medusa/mappers";
import type { MedusaProductListResponse } from "./medusa/types";

export type CatalogSource = "medusa" | "mock";

export interface Catalog {
  products: Product[];
  source: CatalogSource;
}

// Campos que pedimos a Medusa para poder mapear precio, stock y opciones.
const STORE_FIELDS = [
  "id",
  "title",
  "handle",
  "thumbnail",
  "metadata",
  "*images",
  "*categories",
  "*options",
  "*options.values",
  "*variants",
  "*variants.options",
  "*variants.options.option",
  "*variants.inventory_quantity",
  "*variants.calculated_price",
].join(",");

/**
 * Punto único de acceso al catálogo. Intenta Medusa; si no está configurado o
 * falla, devuelve el catálogo mock para que el sitio nunca quede vacío.
 */
export async function getCatalog(): Promise<Catalog> {
  if (!isMedusaEnabled()) {
    return { products: PRODUCTS, source: "mock" };
  }

  const data = await medusaFetch<MedusaProductListResponse>("/store/products", {
    limit: 100,
    fields: STORE_FIELDS,
    region_id: MEDUSA_REGION_ID,
  });

  if (!data || !Array.isArray(data.products) || data.products.length === 0) {
    return { products: PRODUCTS, source: "mock" };
  }

  return { products: data.products.map(mapMedusaProduct), source: "medusa" };
}

export async function getProducts(): Promise<Product[]> {
  return (await getCatalog()).products;
}
