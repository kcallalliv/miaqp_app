"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CartLine, Product } from "@/lib/types";
import { cartKey } from "@/lib/utils";
import { track, EVENTS } from "@/lib/analytics";

interface CartContextValue {
  lines: CartLine[];
  count: number;
  total: number;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  add: (p: Product, opts?: { size?: string; color?: string; qty?: number }) => void;
  increment: (key: string) => void;
  decrement: (key: string) => void;
  remove: (key: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "cavi.cart.v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [map, setMap] = useState<Record<string, CartLine>>({});
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Cargar del almacenamiento local al montar
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setMap(JSON.parse(raw));
    } catch {
      // almacenamiento no disponible: se sigue con carrito vacío
    }
    setHydrated(true);
  }, []);

  // Persistir en cada cambio (después de hidratar)
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
    } catch {
      // ignorar cuota / modo privado
    }
  }, [map, hydrated]);

  function add(
    p: Product,
    opts?: { size?: string; color?: string; qty?: number },
  ) {
    const size = opts?.size;
    const color = opts?.color;
    const qty = opts?.qty ?? 1;
    const key = cartKey(p.id, size, color);
    setMap((prev) => {
      const existing = prev[key];
      const nextQty = (existing?.qty ?? 0) + qty;
      return {
        ...prev,
        [key]: {
          key,
          productId: p.id,
          name: p.name,
          brand: p.brand,
          price: p.price,
          size,
          color,
          accent: p.accent,
          qty: nextQty,
        },
      };
    });
    setIsOpen(true);
    track(EVENTS.ADD_TO_CART, {
      productId: p.id,
      sport: p.sport,
      brand: p.brand,
      value: p.price * qty,
      quantity: qty,
    });
  }

  function increment(key: string) {
    setMap((prev) => {
      const ex = prev[key];
      if (!ex) return prev;
      return { ...prev, [key]: { ...ex, qty: ex.qty + 1 } };
    });
  }

  function decrement(key: string) {
    setMap((prev) => {
      const ex = prev[key];
      if (!ex) return prev;
      const next = ex.qty - 1;
      const copy = { ...prev };
      if (next <= 0) delete copy[key];
      else copy[key] = { ...ex, qty: next };
      return copy;
    });
  }

  function remove(key: string) {
    setMap((prev) => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
  }

  function clear() {
    setMap({});
  }

  const value = useMemo<CartContextValue>(() => {
    const lines = Object.values(map);
    const count = lines.reduce((a, b) => a + b.qty, 0);
    const total = lines.reduce((a, b) => a + b.qty * b.price, 0);
    return {
      lines,
      count,
      total,
      isOpen,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      toggle: () => setIsOpen((o) => !o),
      add,
      increment,
      decrement,
      remove,
      clear,
    };
  }, [map, isOpen]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de <CartProvider>");
  return ctx;
}
