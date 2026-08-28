import type { Sport, Community } from "./types";

export interface Category {
  id: Sport;
  name: string;
  tagline: string;
  /** Métrica deportiva característica, como detalle técnico */
  metric: string;
  accent: string;
  /** ¿Es una de las 5 comunidades de endurance? */
  community: boolean;
}

/**
 * Modelo de datos alineado a Medusa (product categories).
 * Nutrición es la categoría PROTAGONISTA y transversal.
 * Las 5 comunidades de endurance son el foco operativo.
 */
export const CATEGORIES: Category[] = [
  {
    id: "nutricion",
    name: "Nutrición",
    tagline: "Combustible para romper tus límites",
    metric: "60 g CHO /h",
    accent: "#B8FF32",
    community: false,
  },
  {
    id: "trail",
    name: "Trail",
    tagline: "La montaña es la cancha",
    metric: "+D | 1200 m",
    accent: "#FF7A45",
    community: true,
  },
  {
    id: "triatlon",
    name: "Triatlón",
    tagline: "Tres disciplinas, un objetivo",
    metric: "T1 · T2 SPLIT",
    accent: "#38D9C7",
    community: true,
  },
  {
    id: "ruta",
    name: "Ruta",
    tagline: "Cada zancada suma",
    metric: "PACE 4:30 /km",
    accent: "#5C7CFA",
    community: true,
  },
  {
    id: "aguas-abiertas",
    name: "Aguas abiertas",
    tagline: "Desliza más lejos",
    metric: "SWOLF 32",
    accent: "#4DABF7",
    community: true,
  },
  {
    id: "ciclismo",
    name: "Ciclismo",
    tagline: "Potencia sostenida",
    metric: "260 W FTP",
    accent: "#DA77F2",
    community: true,
  },
  {
    id: "accesorios",
    name: "Accesorios",
    tagline: "Los detalles marcan la diferencia",
    metric: "ESSENTIALS",
    accent: "#A7ADB2",
    community: false,
  },
];

/** Las 5 comunidades de endurance, en orden. */
export const COMMUNITIES: Category[] = CATEGORIES.filter((c) => c.community);

export const NUTRITION: Category = CATEGORIES.find((c) => c.id === "nutricion")!;

export const CATEGORY_MAP: Record<Sport, Category> = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c]),
) as Record<Sport, Category>;

export function isCommunity(id: string): id is Community {
  return COMMUNITIES.some((c) => c.id === id);
}
