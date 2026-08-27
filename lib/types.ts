export type Sport =
  | "running"
  | "ciclismo"
  | "triatlon"
  | "natacion"
  | "nutricion"
  | "tecnologia"
  | "accesorios"
  | "recuperacion";

export type Gender = "hombre" | "mujer" | "unisex";

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  sport: Sport;
  gender: Gender;
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
}
