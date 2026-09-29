"use client";

/**
 * Infraestructura mínima de experimentos A/B (Thomke, 2020).
 *
 * - Asignación DETERMINISTA por visitante: un mismo visitante ve siempre la
 *   misma variante (no cambia entre recargas), lo que da resultados confiables
 *   (Thomke Q4). El id de visitante es anónimo y persistente (sin PII).
 * - La exposición se registra UNA vez por sesión y experimento, para poder
 *   calcular el denominador (visitantes expuestos) en BigQuery.
 *
 * Experimento activo:
 *   wa_advisory_v1 — ¿mostrar el CTA de asesoría de WhatsApp de forma
 *   contextual y proactiva a las sesiones de alta intención aumenta el clic
 *   cualificado a WhatsApp, sin dañar la conversión?
 */

export const EXPERIMENTS = {
  WA_ADVISORY: "wa_advisory_v1",
} as const;

export type Variant = "control" | "smart";

const VID_KEY = "cavi.vid"; // id de visitante persistente (localStorage)
const EXP_PREFIX = "cavi.exp."; // marca de exposición por sesión (sessionStorage)

/** Id de visitante anónimo y estable entre sesiones. Sin datos personales. */
export function visitorId(): string {
  if (typeof window === "undefined") return "server";
  try {
    let vid = localStorage.getItem(VID_KEY);
    if (!vid) {
      vid =
        (crypto.randomUUID?.() as string) ||
        `v_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      localStorage.setItem(VID_KEY, vid);
    }
    return vid;
  } catch {
    return "anon";
  }
}

/** Hash estable (FNV-1a de 32 bits) → entero sin signo. */
function hash32(str: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/**
 * Variante asignada al visitante para un experimento (50/50).
 * Determinista: hash(visitante + experimento) → bucket.
 */
export function getVariant(experiment: string): Variant {
  const vid = visitorId();
  return hash32(`${vid}:${experiment}`) % 100 < 50 ? "control" : "smart";
}

/** ¿Ya se registró la exposición de este experimento en la sesión actual? */
export function exposureAlreadyTracked(experiment: string): boolean {
  if (typeof window === "undefined") return true;
  try {
    const k = EXP_PREFIX + experiment;
    if (sessionStorage.getItem(k)) return true;
    sessionStorage.setItem(k, "1");
    return false;
  } catch {
    return false;
  }
}
