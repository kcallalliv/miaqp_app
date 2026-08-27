"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/cart/CartProvider";
import { track, EVENTS } from "@/lib/analytics";
import { useCulqi } from "@/components/checkout/useCulqi";
import { isCulqiEnabled } from "@/lib/culqi";
import { formatPrice } from "@/lib/format";
import { whatsappUrl, supportMessage } from "@/lib/whatsapp";
import {
  ArrowRightIcon,
  ShieldIcon,
  WhatsAppIcon,
  BoltIcon,
  CartIcon,
} from "@/components/ui/icons";

const SHIPPING_FREE_FROM = 300;
const SHIPPING_COST = 15;

interface Form {
  email: string;
  name: string;
  phone: string;
  address: string;
  city: string;
}

export default function CheckoutPage() {
  const { lines, total, clear } = useCart();
  const { ready, openCheckout } = useCulqi();
  const culqiOn = isCulqiEnabled();

  const [form, setForm] = useState<Form>({
    email: "",
    name: "",
    phone: "",
    address: "",
    city: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<{ chargeId: string; demo: boolean } | null>(
    null,
  );

  const shipping = total >= SHIPPING_FREE_FROM || total === 0 ? 0 : SHIPPING_COST;
  const grandTotal = total + shipping;

  // begin_checkout una sola vez cuando hay items.
  const beganRef = useRef(false);
  useEffect(() => {
    if (!beganRef.current && lines.length > 0) {
      beganRef.current = true;
      track(EVENTS.BEGIN_CHECKOUT, {
        value: grandTotal,
        quantity: lines.reduce((a, b) => a + b.qty, 0),
      });
    }
  }, [lines.length, grandTotal]);

  const valid = useMemo(
    () =>
      /.+@.+\..+/.test(form.email) &&
      form.name.trim().length > 2 &&
      form.phone.trim().length >= 6 &&
      form.address.trim().length > 3 &&
      form.city.trim().length > 1,
    [form],
  );

  function set<K extends keyof Form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function charge(tokenId?: string) {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tokenId,
        amount: grandTotal,
        email: form.email,
        customer: {
          name: form.name,
          phone: form.phone,
          address: form.address,
          city: form.city,
        },
        items: lines.map((l) => ({
          name: `${l.brand} ${l.name}`,
          qty: l.qty,
          price: l.price,
        })),
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error || "No se pudo procesar el pago");
    return data as { chargeId: string; demo: boolean };
  }

  async function onPay() {
    setError(null);
    if (!valid) {
      setError("Completa tus datos de envío para continuar.");
      return;
    }
    setLoading(true);
    try {
      let tokenId: string | undefined;
      if (culqiOn) {
        const result = await openCheckout(grandTotal);
        tokenId = result.tokenId;
      }
      const data = await charge(tokenId);
      track(EVENTS.PURCHASE, {
        value: grandTotal,
        currency: "PEN",
        quantity: lines.reduce((a, b) => a + b.qty, 0),
        chargeId: data.chargeId,
        demo: data.demo,
      });
      setDone({ chargeId: data.chargeId, demo: data.demo });
      clear();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ocurrió un error");
    } finally {
      setLoading(false);
    }
  }

  // ---------- Confirmación ----------
  if (done) {
    return (
      <div className="container-cavi flex min-h-[70vh] flex-col items-center justify-center py-20 text-center">
        <span className="mb-5 grid h-16 w-16 place-items-center rounded-full bg-[--color-volt] text-[--color-carbon]">
          <BoltIcon className="h-8 w-8" />
        </span>
        <h1 className="font-display text-3xl font-bold">¡Pedido confirmado!</h1>
        <p className="mt-3 max-w-md text-[--color-muted]">
          Gracias por comprar en CAVI STORE. Te enviaremos la confirmación y el
          seguimiento a <strong className="text-[--color-ink]">{form.email}</strong>.
        </p>
        <p className="mt-2 text-sm text-[--color-muted]">
          N° de operación:{" "}
          <span className="font-mono text-[--color-volt]">{done.chargeId}</span>
        </p>
        {done.demo && (
          <p className="mt-4 rounded-lg border border-[--color-graphite] bg-[--color-anthracite] px-3 py-1.5 text-xs text-[--color-muted]">
            Pago simulado (modo demo). Configura tus claves de Culqi para cobros
            reales.
          </p>
        )}
        <Link href="/" className="btn-volt mt-8">
          Seguir explorando <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  // ---------- Carrito vacío ----------
  if (lines.length === 0) {
    return (
      <div className="container-cavi flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
        <CartIcon className="mb-4 h-12 w-12 text-[--color-muted] opacity-40" />
        <h1 className="font-display text-2xl font-bold">Tu carrito está vacío</h1>
        <p className="mt-2 text-[--color-muted]">
          Agrega productos para continuar con la compra.
        </p>
        <Link href="/#tienda" className="btn-volt mt-6">
          Ir a la tienda
        </Link>
      </div>
    );
  }

  // ---------- Checkout ----------
  return (
    <div className="container-cavi py-12 md:py-16">
      <nav className="mb-8 text-sm text-[--color-muted]">
        <Link href="/" className="hover:text-[--color-ink]">
          Inicio
        </Link>{" "}
        / <span className="text-[--color-ink]">Checkout</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
        {/* Formulario */}
        <div>
          <h1 className="font-display text-2xl font-bold md:text-3xl">
            Finaliza tu compra
          </h1>

          <section className="mt-6">
            <h2 className="mb-3 font-display text-sm font-semibold uppercase tracking-wide text-[--color-muted]">
              Datos de contacto y envío
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field
                label="Email"
                type="email"
                value={form.email}
                onChange={(v) => set("email", v)}
                placeholder="tu@correo.com"
                full
              />
              <Field
                label="Nombre completo"
                value={form.name}
                onChange={(v) => set("name", v)}
                placeholder="Nombre y apellido"
              />
              <Field
                label="Teléfono"
                value={form.phone}
                onChange={(v) => set("phone", v)}
                placeholder="+51 9xx xxx xxx"
              />
              <Field
                label="Dirección"
                value={form.address}
                onChange={(v) => set("address", v)}
                placeholder="Av / Calle, número, referencia"
                full
              />
              <Field
                label="Ciudad"
                value={form.city}
                onChange={(v) => set("city", v)}
                placeholder="Lima, Arequipa…"
              />
            </div>
          </section>

          <section className="mt-8">
            <h2 className="mb-3 font-display text-sm font-semibold uppercase tracking-wide text-[--color-muted]">
              Pago
            </h2>
            <div className="card flex items-start gap-3 p-4">
              <ShieldIcon className="mt-0.5 h-5 w-5 shrink-0 text-[--color-volt]" />
              <div className="text-sm">
                <p className="font-medium text-[--color-ink]">
                  Pago seguro con Culqi
                </p>
                <p className="mt-0.5 text-[--color-muted]">
                  {culqiOn
                    ? "Se abrirá una ventana segura de Culqi para ingresar tu tarjeta. Aceptamos Visa, Mastercard, Amex, Diners y Yape."
                    : "Modo demo activo: aún no hay claves de Culqi configuradas, así que el pago se simulará al confirmar."}
                </p>
              </div>
            </div>
          </section>

          {error && (
            <p className="mt-4 rounded-lg border border-[#FF6B6B]/40 bg-[#FF6B6B]/10 px-3 py-2 text-sm text-[#FF9A9A]">
              {error}
            </p>
          )}
        </div>

        {/* Resumen */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="card p-5">
            <h2 className="font-display text-lg font-semibold">Tu pedido</h2>
            <ul className="mt-4 space-y-3">
              {lines.map((l) => (
                <li key={l.key} className="flex gap-3">
                  <div
                    className="grid h-12 w-12 shrink-0 place-items-center rounded-lg font-display text-sm font-bold"
                    style={{ background: `${l.accent}1f`, color: l.accent }}
                  >
                    {l.brand.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex flex-1 justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium leading-tight">{l.name}</p>
                      <p className="text-xs text-[--color-muted]">
                        {[l.size && `T. ${l.size}`, l.color, `x${l.qty}`]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    </div>
                    <span className="text-sm font-semibold">
                      {formatPrice(l.price * l.qty)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-5 space-y-1.5 border-t border-[--color-graphite] pt-4 text-sm">
              <Row label="Subtotal" value={formatPrice(total)} />
              <Row
                label="Envío"
                value={shipping === 0 ? "Gratis" : formatPrice(shipping)}
                accent={shipping === 0}
              />
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-[--color-graphite] pt-3">
              <span className="font-display font-semibold">Total</span>
              <span className="font-display text-xl font-bold text-[--color-volt]">
                {formatPrice(grandTotal)}
              </span>
            </div>

            <button
              onClick={onPay}
              disabled={loading || (culqiOn && !ready)}
              className="btn-volt mt-5 w-full disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Procesando…"
                : culqiOn
                  ? `Pagar ${formatPrice(grandTotal)}`
                  : `Confirmar pedido (demo)`}
            </button>

            <a
              href={whatsappUrl(supportMessage())}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost mt-2 w-full"
            >
              <WhatsAppIcon className="h-4 w-4 text-[--color-volt]" />
              ¿Dudas? Escríbenos
            </a>

            <p className="mt-3 text-center text-[11px] text-[--color-muted]">
              Envíos a nivel nacional · Compra 100% segura
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  full = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  full?: boolean;
}) {
  return (
    <label className={`flex flex-col gap-1.5 ${full ? "sm:col-span-2" : ""}`}>
      <span className="text-xs font-medium text-[--color-muted]">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="rounded-lg border border-[--color-graphite] bg-[--color-surface] px-3 py-2.5 text-sm text-[--color-ink] outline-none placeholder:text-[--color-muted] focus:border-[--color-volt]"
      />
    </label>
  );
}

function Row({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[--color-muted]">{label}</span>
      <span className={accent ? "font-medium text-[--color-volt]" : ""}>
        {value}
      </span>
    </div>
  );
}
