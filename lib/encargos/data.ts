import { medusaFetch, isMedusaEnabled } from "@/lib/medusa/client";
import type { EncargoItem } from "./types";

/** Ejemplos para modo demo (sin backend). */
const MOCK_ENCARGOS: EncargoItem[] = [
  { id: "en-1", titulo: "Nike Vaporfly 3", categoria: "zapatillas", marca: "Nike", descripcion: "Placa de carbono para competición. Talla a coordinar.", imagen_url: null, precio_usa: 260, precio_peru_aprox: 1099, comision: 180, precio_final: 980, cupos_total: 3, cupos_disponibles: 2, agotado: false, destacado: true },
  { id: "en-2", titulo: "Garmin Forerunner 265", categoria: "tecnologia", marca: "Garmin", descripcion: "Reloj GPS AMOLED multideporte.", imagen_url: null, precio_usa: 449, precio_peru_aprox: 2290, comision: 250, precio_final: 1990, cupos_total: 2, cupos_disponibles: 1, agotado: false, destacado: true },
  { id: "en-3", titulo: "Trisuit HUUB", categoria: "triatlon", marca: "HUUB", descripcion: "Traje de triatlón aero. Indica talla y color.", imagen_url: null, precio_usa: 200, precio_peru_aprox: 950, comision: 150, precio_final: 820, cupos_total: 4, cupos_disponibles: 4, agotado: false, destacado: false },
  { id: "en-4", titulo: "Antiparras Roka R1", categoria: "natacion", marca: "Roka", descripcion: "Aguas abiertas, visión panorámica.", imagen_url: null, precio_usa: 55, precio_peru_aprox: 320, comision: 60, precio_final: 280, cupos_total: 6, cupos_disponibles: 0, agotado: true, destacado: false },
];

export interface EncargosData {
  encargos: EncargoItem[];
  source: "medusa" | "mock";
}

/** Trae los encargos activos desde Medusa; ejemplos solo en modo demo. */
export async function getEncargos(): Promise<EncargosData> {
  // Sin backend configurado → modo demo con ejemplos.
  if (!isMedusaEnabled()) return { encargos: MOCK_ENCARGOS, source: "mock" };

  // Con backend real: mostramos EXACTAMENTE lo que haya (vacío si no hay),
  // nunca ejemplos falsos que la gente pudiera intentar reservar.
  const data = await medusaFetch<{ encargos: EncargoItem[] }>("/store/encargos");
  return { encargos: data?.encargos ?? [], source: "medusa" };
}
