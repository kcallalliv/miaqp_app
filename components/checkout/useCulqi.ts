"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CULQI_PUBLIC_KEY, toCulqiAmount } from "@/lib/culqi";

const CULQI_SCRIPT = "https://checkout.culqi.com/js/v4";

// Tipado mínimo de la API global de Culqi Checkout v4.
interface CulqiGlobal {
  publicKey: string;
  token?: { id: string; email?: string };
  order?: { id: string };
  error?: { user_message?: string; merchant_message?: string };
  settings: (opts: {
    title: string;
    currency: string;
    amount: number;
    order?: string;
  }) => void;
  options?: (opts: Record<string, unknown>) => void;
  open: () => void;
  close?: () => void;
}

declare global {
  interface Window {
    Culqi?: CulqiGlobal;
    culqi?: () => void;
  }
}

export interface CulqiResult {
  tokenId: string;
  email?: string;
}

/**
 * Carga Culqi Checkout y expone `openCheckout`. El callback global `window.culqi`
 * se resuelve mediante una promesa por apertura.
 */
export function useCulqi() {
  const [ready, setReady] = useState(false);
  const resolver = useRef<{
    resolve: (r: CulqiResult) => void;
    reject: (e: Error) => void;
  } | null>(null);

  useEffect(() => {
    if (!CULQI_PUBLIC_KEY) return;
    if (document.querySelector(`script[src="${CULQI_SCRIPT}"]`)) {
      setReady(true);
      return;
    }
    const script = document.createElement("script");
    script.src = CULQI_SCRIPT;
    script.async = true;
    script.onload = () => setReady(true);
    document.body.appendChild(script);

    // Callback global que Culqi invoca al cerrar el modal.
    window.culqi = () => {
      const C = window.Culqi;
      if (!C) return;
      if (C.token?.id) {
        resolver.current?.resolve({ tokenId: C.token.id, email: C.token.email });
      } else if (C.error) {
        resolver.current?.reject(
          new Error(C.error.user_message || "Pago rechazado por Culqi"),
        );
      }
      resolver.current = null;
    };
  }, []);

  const openCheckout = useCallback(
    (amountSoles: number): Promise<CulqiResult> => {
      return new Promise<CulqiResult>((resolve, reject) => {
        const C = window.Culqi;
        if (!C || !CULQI_PUBLIC_KEY) {
          reject(new Error("Culqi no está disponible"));
          return;
        }
        resolver.current = { resolve, reject };
        C.publicKey = CULQI_PUBLIC_KEY;
        C.settings({
          title: "CAVI STORE",
          currency: "PEN",
          amount: toCulqiAmount(amountSoles),
        });
        C.open();
      });
    },
    [],
  );

  return { ready, openCheckout };
}
