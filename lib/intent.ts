"use client";

/**
 * Score de intención de sesión (heurística, NO ML todavía).
 *
 * Thomke/Mazzei: primero validamos con reglas simples y un A/B test; el modelo
 * de ML entra sólo cuando el experimento demuestre valor y haya volumen.
 *
 * Se alimenta automáticamente de los mismos eventos de analítica (ver
 * `feedIntent` en `lib/analytics.ts`) y guarda contadores anónimos en
 * sessionStorage. Cada cambio emite un CustomEvent `cavi:intent` para que la
 * UI (el CTA de asesoría) reaccione sin recargar.
 */

const KEY = "cavi.intent.v1";
export const INTENT_EVENT = "cavi:intent";
/** Umbral de "alta intención" para el experimento. */
export const HIGH_INTENT = 40;

export interface Signals {
  views: number; // vistas de producto
  nutritionViews: number; // vistas/adds de nutrición (protagonista)
  adds: number; // add to cart
  preorder: number; // solicitudes de preventa
  searches: number; // búsquedas
  events: number; // vistas de la agenda
}

const EMPTY: Signals = {
  views: 0,
  nutritionViews: 0,
  adds: 0,
  preorder: 0,
  searches: 0,
  events: 0,
};

function read(): Signals {
  if (typeof window === "undefined") return { ...EMPTY };
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? { ...EMPTY, ...(JSON.parse(raw) as Signals) } : { ...EMPTY };
  } catch {
    return { ...EMPTY };
  }
}

function write(s: Signals): void {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(s));
    window.dispatchEvent(new CustomEvent(INTENT_EVENT, { detail: score(s) }));
  } catch {
    // sessionStorage no disponible: la heurística simplemente no acumula
  }
}

/** Pondera las señales en un score 0–100. */
export function score(s: Signals): number {
  const raw =
    s.views * 8 +
    s.nutritionViews * 12 +
    s.adds * 25 +
    s.preorder * 30 +
    s.searches * 6 +
    s.events * 5;
  return Math.min(100, raw);
}

export function getSignals(): Signals {
  return read();
}

export function getIntentScore(): number {
  return score(read());
}

/**
 * ¿Sesión de alta intención? Exige score alto Y al menos dos tipos de señal,
 * para no dispararse con un solo pageview accidental.
 */
export function isHighIntent(): boolean {
  const s = read();
  const distinct = Object.values(s).filter((n) => n > 0).length;
  return distinct >= 2 && score(s) >= HIGH_INTENT;
}

/** ¿El interés se inclina a nutrición? Personaliza el mensaje de asesoría. */
export function leansNutrition(): boolean {
  const s = read();
  return s.nutritionViews > 0 && s.nutritionViews >= s.views - s.nutritionViews;
}

/** Actualiza los contadores a partir de un evento de analítica. */
export function feedIntent(event: string, props: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  const s = read();
  const isNut = props.isNutrition === true || props.community === "nutricion";
  switch (event) {
    case "view_item":
      s.views += 1;
      if (isNut) s.nutritionViews += 1;
      break;
    case "add_to_cart":
      s.adds += 1;
      if (isNut) s.nutritionViews += 1;
      break;
    case "preorder_request":
      s.preorder += 1;
      break;
    case "search":
      s.searches += 1;
      break;
    case "event_view":
      s.events += 1;
      break;
    default:
      return; // otros eventos no alimentan la intención
  }
  write(s);
}
