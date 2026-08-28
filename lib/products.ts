import type { Product } from "./types";

/**
 * Catálogo mock (fallback cuando Medusa no está configurado).
 * Foco: NUTRICIÓN protagonista + equipamiento de las 5 comunidades endurance.
 * En producción, la fuente de verdad es Medusa (PostgreSQL).
 */
export const PRODUCTS: Product[] = [
  // ---------------- NUTRICIÓN (protagonista) ----------------
  {
    id: "nut-01", slug: "maurten-gel-100", name: "Gel 100 (caja x12)", brand: "Maurten",
    sport: "nutricion", communities: ["nutricion", "ruta", "trail", "triatlon"], gender: "unisex",
    fulfillment: "stock", price: 380, compareAtPrice: 420, rating: 4.9, reviews: 301, stock: 60,
    sizes: ["Caja x12"], colors: ["Neutro"], badge: "Top ventas", accent: "#B8FF32", featured: true,
  },
  {
    id: "nut-02", slug: "maurten-drink-mix-320", name: "Drink Mix 320 (caja x14)", brand: "Maurten",
    sport: "nutricion", communities: ["nutricion", "triatlon", "ciclismo"], gender: "unisex",
    fulfillment: "stock", price: 460, rating: 4.9, reviews: 128, stock: 34,
    sizes: ["Caja x14"], colors: ["Neutro"], badge: "Alta carga", accent: "#B8FF32", featured: true,
  },
  {
    id: "nut-03", slug: "sis-beta-fuel", name: "Beta Fuel 80 (caja x15)", brand: "SiS",
    sport: "nutricion", communities: ["nutricion", "ciclismo", "ruta"], gender: "unisex",
    fulfillment: "stock", price: 320, compareAtPrice: 360, rating: 4.7, reviews: 142, stock: 40,
    sizes: ["Caja x15"], colors: ["Naranja", "Limón"], accent: "#FFD43B", featured: true,
  },
  {
    id: "nut-04", slug: "precision-hydration-1500", name: "PH 1500 Electrolitos (x30)", brand: "Precision",
    sport: "nutricion", communities: ["nutricion", "trail", "triatlon", "aguas-abiertas"], gender: "unisex",
    fulfillment: "stock", price: 240, rating: 4.8, reviews: 96, stock: 50,
    sizes: ["Sobre x30"], colors: ["Neutro"], badge: "Sales · altura", accent: "#4DABF7", featured: true,
  },
  {
    id: "nut-05", slug: "precision-gel-30", name: "PF 30 Gel (caja x12)", brand: "Precision",
    sport: "nutricion", communities: ["nutricion", "ruta", "trail"], gender: "unisex",
    fulfillment: "stock", price: 300, rating: 4.7, reviews: 71, stock: 45,
    sizes: ["Caja x12"], colors: ["Neutro"], accent: "#B8FF32",
  },
  {
    id: "nut-06", slug: "sis-hydro-tabs", name: "GO Hydro Pastillas (x20)", brand: "SiS",
    sport: "nutricion", communities: ["nutricion", "ruta", "ciclismo"], gender: "unisex",
    fulfillment: "stock", price: 85, rating: 4.6, reviews: 210, stock: 120,
    sizes: ["Tubo x20"], colors: ["Frutos", "Limón"], badge: "Hidratación", accent: "#FFD43B",
  },

  // ---------------- TRAIL ----------------
  {
    id: "trail-01", slug: "hoka-speedgoat-6", name: "Speedgoat 6 Trail", brand: "HOKA",
    sport: "trail", communities: ["trail"], gender: "unisex",
    fulfillment: "stock", price: 720, compareAtPrice: 820, rating: 4.8, reviews: 88, stock: 12,
    sizes: ["39", "40", "41", "42", "43", "44"], colors: ["Naranja", "Negro"], badge: "Top ventas", accent: "#FF7A45", featured: true,
  },
  {
    id: "trail-02", slug: "salomon-adv-skin-12", name: "ADV Skin 12 Chaleco", brand: "Salomon",
    sport: "trail", communities: ["trail"], gender: "unisex",
    fulfillment: "preorder", price: 890, rating: 4.9, reviews: 41, stock: 0,
    sizes: ["S", "M", "L"], colors: ["Negro/Rojo"], badge: "Bajo pedido", accent: "#FF7A45",
  },

  // ---------------- RUTA (running) ----------------
  {
    id: "ruta-01", slug: "nike-vaporfly-3", name: "Vaporfly 3 Carbon", brand: "Nike",
    sport: "ruta", communities: ["ruta", "triatlon"], gender: "unisex",
    fulfillment: "stock", price: 899, compareAtPrice: 1099, rating: 4.9, reviews: 214, stock: 10,
    sizes: ["38", "39", "40", "41", "42", "43", "44"], colors: ["Volt", "Negro"], badge: "Carbono", accent: "#5C7CFA", featured: true,
  },
  {
    id: "ruta-02", slug: "garmin-forerunner-965", name: "Forerunner 965 AMOLED", brand: "Garmin",
    sport: "ruta", communities: ["ruta", "trail", "triatlon"], gender: "unisex",
    fulfillment: "preorder", price: 2490, compareAtPrice: 2790, rating: 4.9, reviews: 176, stock: 0,
    sizes: ["47 mm"], colors: ["Negro/Volt", "Blanco"], badge: "GPS Multibanda", accent: "#5C7CFA", featured: true,
  },

  // ---------------- TRIATLÓN ----------------
  {
    id: "tri-01", slug: "huub-aero-trisuit", name: "Aero Trisuit Elite", brand: "HUUB",
    sport: "triatlon", communities: ["triatlon"], gender: "hombre",
    fulfillment: "preorder", price: 890, compareAtPrice: 1050, rating: 4.7, reviews: 41, stock: 0,
    sizes: ["S", "M", "L", "XL"], colors: ["Negro/Volt"], badge: "Bajo pedido", accent: "#38D9C7",
  },
  {
    id: "tri-02", slug: "orca-wetsuit-openwater", name: "Wetsuit Openwater 3.8", brand: "Orca",
    sport: "triatlon", communities: ["triatlon", "aguas-abiertas"], gender: "unisex",
    fulfillment: "preorder", price: 1590, rating: 4.8, reviews: 52, stock: 0,
    sizes: ["S", "M", "L", "XL"], colors: ["Negro"], badge: "Bajo pedido", accent: "#38D9C7", featured: true,
  },

  // ---------------- AGUAS ABIERTAS ----------------
  {
    id: "aa-01", slug: "arena-cobra-ultra", name: "Cobra Ultra Swipe", brand: "Arena",
    sport: "aguas-abiertas", communities: ["aguas-abiertas", "triatlon"], gender: "unisex",
    fulfillment: "stock", price: 245, compareAtPrice: 299, rating: 4.8, reviews: 121, stock: 18,
    sizes: ["Única"], colors: ["Espejo Volt", "Negro"], badge: "Top ventas", accent: "#4DABF7",
  },
  {
    id: "aa-02", slug: "orca-openwater-buoy", name: "Boya de seguridad Openwater", brand: "Orca",
    sport: "aguas-abiertas", communities: ["aguas-abiertas"], gender: "unisex",
    fulfillment: "stock", price: 180, rating: 4.6, reviews: 63, stock: 22,
    sizes: ["Única"], colors: ["Naranja"], accent: "#4DABF7",
  },

  // ---------------- CICLISMO ----------------
  {
    id: "bike-01", slug: "specialized-evade-3", name: "Casco Evade 3 Aero", brand: "Specialized",
    sport: "ciclismo", communities: ["ciclismo", "triatlon"], gender: "unisex",
    fulfillment: "preorder", price: 1150, compareAtPrice: 1350, rating: 4.8, reviews: 88, stock: 0,
    sizes: ["S", "M", "L"], colors: ["Negro", "Blanco"], badge: "Bajo pedido", accent: "#DA77F2",
  },
  {
    id: "bike-02", slug: "assos-mille-bib", name: "Mille GT Bib Shorts", brand: "Assos",
    sport: "ciclismo", communities: ["ciclismo"], gender: "hombre",
    fulfillment: "stock", price: 640, rating: 4.7, reviews: 67, stock: 16,
    sizes: ["S", "M", "L", "XL"], colors: ["Negro"], accent: "#DA77F2",
  },

  // ---------------- ACCESORIOS ----------------
  {
    id: "acc-01", slug: "flipbelt-classic", name: "Cinturón FlipBelt", brand: "FlipBelt",
    sport: "accesorios", communities: ["accesorios", "ruta", "trail"], gender: "unisex",
    fulfillment: "stock", price: 145, rating: 4.6, reviews: 98, stock: 50,
    sizes: ["S", "M", "L"], colors: ["Negro", "Volt"], accent: "#A7ADB2",
  },
];

export function getFeatured(): Product[] {
  return PRODUCTS.filter((p) => p.featured);
}

export function getNutrition(): Product[] {
  return PRODUCTS.filter((p) => p.sport === "nutricion");
}
