/** Subconjunto de la forma de respuesta de la Store API de Medusa v2 que usamos. */

export interface MedusaCalculatedPrice {
  calculated_amount: number | null;
  original_amount: number | null;
  currency_code: string | null;
}

export interface MedusaVariant {
  id: string;
  title: string | null;
  sku: string | null;
  inventory_quantity?: number | null;
  calculated_price?: MedusaCalculatedPrice | null;
  options?: { option?: { title?: string | null } | null; value: string }[];
}

export interface MedusaCategory {
  id: string;
  name: string;
  handle: string;
}

export interface MedusaImage {
  url: string;
}

export interface MedusaProduct {
  id: string;
  title: string;
  handle: string;
  description?: string | null;
  thumbnail?: string | null;
  images?: MedusaImage[];
  variants?: MedusaVariant[];
  categories?: MedusaCategory[];
  options?: { title: string; values?: { value: string }[] }[];
  metadata?: Record<string, unknown> | null;
}

export interface MedusaProductListResponse {
  products: MedusaProduct[];
  count: number;
  offset: number;
  limit: number;
}
