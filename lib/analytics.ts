"use client";

/**
 * Capa de analítica del storefront. Envía eventos a `/api/events`, que los
 * inserta en BigQuery (o los registra en modo demo sin configuración).
 *
 * Sin dependencias: usa `navigator.sendBeacon` cuando existe (no bloquea la
 * navegación) y cae a `fetch` con keepalive.
 */

export const EVENTS = {
  PAGE_VIEW: "page_view",
  VIEW_ITEM: "view_item",
  SEARCH: "search",
  ADD_TO_CART: "add_to_cart",
  BEGIN_CHECKOUT: "begin_checkout",
  PURCHASE: "purchase",
} as const;

export type EventName = (typeof EVENTS)[keyof typeof EVENTS];

export interface EventProps {
  productId?: string;
  sport?: string;
  brand?: string;
  value?: number;
  currency?: string;
  quantity?: number;
  [key: string]: unknown;
}

const SESSION_KEY = "cavi.sid";

function sessionId(): string {
  if (typeof window === "undefined") return "server";
  try {
    let sid = sessionStorage.getItem(SESSION_KEY);
    if (!sid) {
      sid =
        (crypto.randomUUID?.() as string) ||
        `s_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      sessionStorage.setItem(SESSION_KEY, sid);
    }
    return sid;
  } catch {
    return "anon";
  }
}

export function track(event: EventName, props: EventProps = {}): void {
  if (typeof window === "undefined") return;

  const body = JSON.stringify({
    event,
    sessionId: sessionId(),
    path: window.location.pathname,
    occurredAt: new Date().toISOString(),
    ...props,
  });

  try {
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/events", new Blob([body], { type: "application/json" }));
      return;
    }
  } catch {
    // cae a fetch
  }
  // keepalive permite que el request sobreviva a la navegación
  fetch("/api/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => {});
}
