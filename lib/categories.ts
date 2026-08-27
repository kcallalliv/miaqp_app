import type { Sport } from "./types";

export interface Category {
  id: Sport;
  name: string;
  tagline: string;
  /** Métrica deportiva característica, como detalle técnico */
  metric: string;
  accent: string;
}

/** Deportes destacados: la tienda se especializa en running y natación. */
export const CATEGORIES: Category[] = [
  {
    id: "running",
    name: "Running",
    tagline: "Cada zancada cuenta",
    metric: "PACE 4:30 /km",
    accent: "#B8FF32",
  },
  {
    id: "natacion",
    name: "Natación",
    tagline: "Desliza más rápido",
    metric: "SWOLF 32",
    accent: "#38D9C7",
  },
  {
    id: "triatlon",
    name: "Triatlón",
    tagline: "Tres disciplinas, un objetivo",
    metric: "T1 · T2 SPLIT",
    accent: "#FF7A45",
  },
  {
    id: "ciclismo",
    name: "Ciclismo",
    tagline: "Potencia sostenida",
    metric: "260 W FTP",
    accent: "#5C7CFA",
  },
  {
    id: "nutricion",
    name: "Nutrición deportiva",
    tagline: "Combustible para rendir",
    metric: "60 g CHO /h",
    accent: "#FFD43B",
  },
  {
    id: "tecnologia",
    name: "Tecnología y wearables",
    tagline: "Mide, analiza, mejora",
    metric: "GPS · HR · PWR",
    accent: "#B8FF32",
  },
  {
    id: "accesorios",
    name: "Accesorios",
    tagline: "Los detalles marcan la diferencia",
    metric: "ESSENTIALS",
    accent: "#A7ADB2",
  },
  {
    id: "recuperacion",
    name: "Recuperación",
    tagline: "Entrena. Recupera. Repite.",
    metric: "HRV READY",
    accent: "#DA77F2",
  },
];

export const CATEGORY_MAP: Record<Sport, Category> = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c]),
) as Record<Sport, Category>;
