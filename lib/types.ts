/** Las 5 comunidades de endurance (foco operativo de CAVI). */
export type Community = "trail" | "triatlon" | "ruta" | "aguas-abiertas" | "ciclismo";

/**
 * Categoría de producto: una comunidad, la categoría transversal Nutrición
 * (protagonista del negocio) o Accesorios.
 */
export type Sport = Community | "nutricion" | "accesorios";

/** Modelo de venta del producto (viene de metadata.fulfillment en Medusa). */
export type Fulfillment = "stock" | "preorder";

export type Gender = "hombre" | "mujer" | "unisex";

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  /** Categoría principal (comunidad, nutrición o accesorios). */
  sport: Sport;
  /** Todas las categorías a las que pertenece (un gel puede estar en varias). */
  communities: Sport[];
  gender: Gender;
  /** "stock" (En stock) | "preorder" (Bajo pedido, se asesora por WhatsApp). */
  fulfillment: Fulfillment;
  price: number;
  /** Precio anterior, cuando hay descuento */
  compareAtPrice?: number;
  rating: number;
  reviews: number;
  /** Unidades disponibles; 0 = agotado */
  stock: number;
  sizes: string[];
  colors: string[];
  /** Insignia opcional: "Nuevo", "Top ventas", etc. */
  badge?: string;
  /** Accento de color para el placeholder visual (hasta tener fotos reales) */
  accent: string;
  featured?: boolean;
  /** URL de imagen real (proveniente de Medusa); opcional */
  thumbnail?: string;
}

/** ¿Es un producto de nutrición/fueling? (categoría protagonista) */
export function isNutrition(p: Product): boolean {
  return p.sport === "nutricion" || p.communities.includes("nutricion");
}

/** Equipamiento caro que amerita asesoría por WhatsApp (talla/ajuste/elección). */
export function needsAdvice(p: Product): boolean {
  return p.fulfillment === "preorder" || p.price >= 800;
}

export interface CartLine {
  key: string;
  productId: string;
  name: string;
  brand: string;
  price: number;
  size?: string;
  color?: string;
  accent: string;
  qty: number;
  /** Comunidad/categoría principal (para analítica de compra). */
  community?: Sport;
}
