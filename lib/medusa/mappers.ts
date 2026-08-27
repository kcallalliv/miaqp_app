import type { Product, Sport, Gender } from "@/lib/types";
import { CATEGORY_MAP } from "@/lib/categories";
import type { MedusaProduct, MedusaVariant } from "./types";

const SPORTS: Sport[] = [
  "running",
  "ciclismo",
  "triatlon",
  "natacion",
  "nutricion",
  "tecnologia",
  "accesorios",
  "recuperacion",
];
const GENDERS: Gender[] = ["hombre", "mujer", "unisex"];

function str(meta: Record<string, unknown> | null | undefined, key: string) {
  const v = meta?.[key];
  return typeof v === "string" ? v : undefined;
}
function num(meta: Record<string, unknown> | null | undefined, key: string) {
  const v = meta?.[key];
  if (typeof v === "number") return v;
  if (typeof v === "string" && v.trim() !== "" && !Number.isNaN(Number(v)))
    return Number(v);
  return undefined;
}

/** Deriva el deporte desde metadata, o desde la categoría, con fallback. */
function resolveSport(mp: MedusaProduct): Sport {
  const fromMeta = str(mp.metadata, "sport") as Sport | undefined;
  if (fromMeta && SPORTS.includes(fromMeta)) return fromMeta;
  const handle = mp.categories?.[0]?.handle as Sport | undefined;
  if (handle && SPORTS.includes(handle)) return handle;
  return "accesorios";
}

function resolveGender(mp: MedusaProduct): Gender {
  const g = str(mp.metadata, "gender") as Gender | undefined;
  return g && GENDERS.includes(g) ? g : "unisex";
}

function variantPrice(v: MedusaVariant): { price?: number; compareAt?: number } {
  const cp = v.calculated_price;
  if (!cp || cp.calculated_amount == null) return {};
  const price = cp.calculated_amount;
  const compareAt =
    cp.original_amount != null && cp.original_amount > price
      ? cp.original_amount
      : undefined;
  return { price, compareAt };
}

/** Extrae valores únicos de una opción (por título) a partir de las variantes. */
function optionValues(mp: MedusaProduct, optionTitle: string): string[] {
  const set = new Set<string>();
  for (const v of mp.variants ?? []) {
    for (const o of v.options ?? []) {
      if (o.option?.title?.toLowerCase() === optionTitle.toLowerCase()) {
        set.add(o.value);
      }
    }
  }
  // Fallback: usar el listado de opciones del producto.
  if (set.size === 0) {
    const opt = mp.options?.find(
      (o) => o.title.toLowerCase() === optionTitle.toLowerCase(),
    );
    opt?.values?.forEach((val) => set.add(val.value));
  }
  return Array.from(set);
}

/** Convierte un producto de la Store API de Medusa a nuestro DTO de UI. */
export function mapMedusaProduct(mp: MedusaProduct): Product {
  const sport = resolveSport(mp);
  const variants = mp.variants ?? [];

  // Precio mínimo entre variantes (el "desde").
  let price = Number.POSITIVE_INFINITY;
  let compareAt: number | undefined;
  for (const v of variants) {
    const { price: p, compareAt: c } = variantPrice(v);
    if (p != null && p < price) {
      price = p;
      compareAt = c;
    }
  }
  if (!Number.isFinite(price)) price = num(mp.metadata, "price") ?? 0;
  // Fallback de "precio anterior" desde metadata cuando no hay price list de oferta.
  if (compareAt == null) {
    const metaCompare = num(mp.metadata, "compare_at");
    if (metaCompare != null && metaCompare > price) compareAt = metaCompare;
  }

  // Stock real desde inventario; si no se gestiona, cae a metadata.stock.
  const invSum = variants.reduce(
    (sum, v) => sum + (v.inventory_quantity ?? 0),
    0,
  );
  const stock = invSum > 0 ? invSum : num(mp.metadata, "stock") ?? 0;

  const sizes = optionValues(mp, "Talla");
  let colors = optionValues(mp, "Color");
  if (colors.length === 0) {
    const metaColors = str(mp.metadata, "colors");
    if (metaColors)
      colors = metaColors
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean);
  }

  const accent =
    str(mp.metadata, "accent") ?? CATEGORY_MAP[sport]?.accent ?? "#B8FF32";

  return {
    id: mp.id,
    slug: mp.handle,
    name: mp.title,
    brand: str(mp.metadata, "brand") ?? "CAVI",
    sport,
    gender: resolveGender(mp),
    price,
    compareAtPrice: compareAt,
    rating: num(mp.metadata, "rating") ?? 4.7,
    reviews: num(mp.metadata, "reviews") ?? 0,
    stock,
    sizes: sizes.length ? sizes : ["Única"],
    colors: colors.length ? colors : ["Estándar"],
    badge: str(mp.metadata, "badge"),
    accent,
    featured: str(mp.metadata, "featured") === "true",
    // Imagen real cuando exista (se usará cuando migremos ProductVisual → <Image>).
    thumbnail: mp.thumbnail ?? undefined,
  };
}
