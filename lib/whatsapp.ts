import type { CartLine } from "./types";
import { formatPrice } from "./format";

/** Número de WhatsApp del negocio (configurable por entorno). */
export const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "51966538608";

export function whatsappUrl(text: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

/** Mensaje de soporte/consulta general. */
export function supportMessage(): string {
  return "Hola CAVI STORE 👋, tengo una consulta.";
}

/** Asesoría de un producto (equipamiento caro): incluye nombre y marca. */
export function adviceMessage(brand: string, name: string): string {
  return `Hola CAVI STORE 👋, quiero asesoría para elegir/ajustar la talla de: ${brand} ${name}. ¿Me ayudan?`;
}

/** Pedido bajo pedido (pre-orden) de un producto. */
export function preorderMessage(brand: string, name: string): string {
  return `Hola CAVI STORE 👋, me interesa el producto bajo pedido: ${brand} ${name}. ¿Disponibilidad, tallas y tiempo de entrega?`;
}

/** Mensaje de pedido a partir del carrito. */
export function orderMessage(lines: CartLine[], total: number): string {
  if (!lines.length) return "Hola CAVI STORE, quisiera hacer un pedido.";
  const detail = lines
    .map(
      (l) =>
        `• ${l.qty}× ${l.brand} ${l.name}` +
        `${l.size ? ` (Talla ${l.size})` : ""}` +
        `${l.color ? ` [${l.color}]` : ""} — ${formatPrice(l.price)}`,
    )
    .join("\n");
  return `Hola CAVI STORE, quiero comprar:\n${detail}\n\nTotal estimado: ${formatPrice(
    total,
  )}`;
}
