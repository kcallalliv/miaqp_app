"use client";

import Link from "next/link";
import { useCart } from "./CartProvider";
import { formatPrice } from "@/lib/format";
import { whatsappUrl, orderMessage } from "@/lib/whatsapp";
import {
  CloseIcon,
  PlusIcon,
  MinusIcon,
  WhatsAppIcon,
  CartIcon,
} from "@/components/ui/icons";

export function CartDrawer() {
  const { isOpen, close, lines, count, total, increment, decrement, remove } =
    useCart();

  const whatsappHref = whatsappUrl(orderMessage(lines, total));

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={close}
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden
      />

      {/* Panel */}
      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-[--color-graphite] bg-[--color-anthracite] shadow-2xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-label="Carrito de compras"
      >
        <header className="flex items-center justify-between border-b border-[--color-graphite] px-5 py-4">
          <div className="flex items-center gap-2">
            <CartIcon className="h-5 w-5 text-[--color-volt]" />
            <span className="font-display font-semibold">
              Tu carrito
              <span className="ml-1 text-[--color-muted]">({count})</span>
            </span>
          </div>
          <button
            onClick={close}
            className="rounded-lg p-1.5 text-[--color-muted] hover:bg-[--color-surface] hover:text-[--color-ink]"
            aria-label="Cerrar carrito"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {lines.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center text-[--color-muted]">
              <CartIcon className="mb-3 h-10 w-10 opacity-40" />
              <p>Tu carrito está vacío.</p>
              <button
                onClick={close}
                className="btn-ghost mt-5"
              >
                Seguir explorando
              </button>
            </div>
          ) : (
            <ul className="space-y-3">
              {lines.map((l) => (
                <li
                  key={l.key}
                  className="flex gap-3 rounded-xl border border-[--color-graphite] bg-[--color-surface] p-3"
                >
                  <div
                    className="grid h-16 w-16 shrink-0 place-items-center rounded-lg font-display font-bold"
                    style={{
                      background: `${l.accent}1f`,
                      color: l.accent,
                    }}
                  >
                    {l.brand.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-[11px] uppercase tracking-wide text-[--color-muted]">
                          {l.brand}
                        </p>
                        <p className="text-sm font-medium leading-tight text-[--color-ink]">
                          {l.name}
                        </p>
                        <p className="mt-0.5 text-xs text-[--color-muted]">
                          {[l.size && `Talla ${l.size}`, l.color]
                            .filter(Boolean)
                            .join(" · ")}
                        </p>
                      </div>
                      <button
                        onClick={() => remove(l.key)}
                        className="text-xs text-[--color-muted] hover:text-[#FF6B6B]"
                      >
                        Quitar
                      </button>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-1 rounded-lg border border-[--color-graphite]">
                        <button
                          onClick={() => decrement(l.key)}
                          className="grid h-7 w-7 place-items-center text-[--color-muted] hover:text-[--color-ink]"
                          aria-label="Quitar una unidad"
                        >
                          <MinusIcon className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-6 text-center text-sm">{l.qty}</span>
                        <button
                          onClick={() => increment(l.key)}
                          className="grid h-7 w-7 place-items-center text-[--color-muted] hover:text-[--color-ink]"
                          aria-label="Agregar una unidad"
                        >
                          <PlusIcon className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <span className="font-display text-sm font-semibold">
                        {formatPrice(l.price * l.qty)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {lines.length > 0 && (
          <footer className="border-t border-[--color-graphite] px-5 py-4">
            <div className="mb-1 flex items-center justify-between text-sm text-[--color-muted]">
              <span>Subtotal</span>
              <span>{formatPrice(total)}</span>
            </div>
            <div className="mb-4 flex items-center justify-between">
              <span className="font-display font-semibold">Total estimado</span>
              <span className="font-display text-lg font-bold text-[--color-volt]">
                {formatPrice(total)}
              </span>
            </div>
            <Link href="/checkout" onClick={close} className="btn-volt w-full">
              Ir al checkout
            </Link>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost mt-2 w-full"
            >
              <WhatsAppIcon className="h-4 w-4 text-[--color-volt]" />
              Pedir por WhatsApp
            </a>
            <p className="mt-3 text-center text-[11px] text-[--color-muted]">
              Envíos a nivel nacional · Pago seguro con Culqi
            </p>
          </footer>
        )}
      </aside>
    </>
  );
}
