"use client";

import { useState } from "react";
import Link from "next/link";
import { COMPANY } from "@/lib/company";

type Estado = "form" | "enviando" | "ok" | "error";

const field =
  "w-full rounded-lg border border-[--color-graphite] bg-[--color-surface] px-3 py-2 text-sm text-[--color-ink] outline-none focus:border-[--color-volt]";
const label = "mb-1 block text-xs font-medium text-[--color-muted]";

export default function ReclamacionesPage() {
  const [estado, setEstado] = useState<Estado>("form");
  const [correlativo, setCorrelativo] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setEstado("enviando");
    setError("");
    const fd = new FormData(e.currentTarget);
    const payload = Object.fromEntries(fd.entries());
    try {
      const res = await fetch("/api/reclamaciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "No se pudo registrar.");
        setEstado("error");
        return;
      }
      setCorrelativo(data.correlativo || "");
      setEstado("ok");
    } catch {
      setError("No se pudo conectar. Intenta más tarde.");
      setEstado("error");
    }
  }

  if (estado === "ok") {
    return (
      <div className="container-cavi py-20">
        <div className="mx-auto max-w-lg rounded-2xl border border-[--color-graphite] bg-[--color-surface] p-8 text-center">
          <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full bg-[--color-volt] text-2xl text-[--color-carbon]">
            ✓
          </div>
          <h1 className="font-display text-2xl font-bold text-[--color-ink]">
            Hoja registrada
          </h1>
          <p className="mt-2 text-sm text-[--color-muted]">
            Tu código de seguimiento es:
          </p>
          <p className="mt-1 font-display text-lg font-semibold text-[--color-volt]">
            {correlativo}
          </p>
          <p className="mt-4 text-sm text-[--color-muted]">
            Te responderemos a tu correo dentro del plazo de ley (15 días
            hábiles). Guarda este código.
          </p>
          <Link
            href="/"
            className="mt-6 inline-block rounded-lg bg-[--color-volt] px-5 py-2 text-sm font-semibold text-[--color-carbon]"
          >
            Volver a la tienda
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-cavi py-14">
      <Link
        href="/"
        className="text-sm text-[--color-muted] hover:text-[--color-volt]"
      >
        ← Volver a la tienda
      </Link>

      <div className="mt-6 grid gap-8 md:grid-cols-[1fr_320px]">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3">
            <h1 className="font-display text-3xl font-bold text-[--color-ink]">
              Libro de Reclamaciones
            </h1>
            <span className="rounded-md border border-[--color-graphite] px-2 py-1 text-[11px] text-[--color-muted]">
              Virtual
            </span>
          </div>
          <p className="mt-2 text-sm text-[--color-muted]">
            Conforme al Código de Protección y Defensa del Consumidor (Perú).
            Completa el formulario y recibirás un código de seguimiento.
          </p>

          <form onSubmit={onSubmit} className="mt-8 grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <span className={label}>Tipo de solicitud</span>
              <div className="flex gap-4 text-sm text-[--color-ink]">
                <label className="flex items-center gap-2">
                  <input type="radio" name="tipo" value="reclamo" defaultChecked />
                  Reclamo (producto/servicio)
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="tipo" value="queja" />
                  Queja (atención)
                </label>
              </div>
            </div>

            <div>
              <label className={label}>Nombre completo *</label>
              <input name="nombre" required className={field} />
            </div>
            <div>
              <label className={label}>Correo electrónico *</label>
              <input name="email" type="email" required className={field} />
            </div>

            <div>
              <label className={label}>Tipo de documento</label>
              <select name="tipo_documento" className={field} defaultValue="DNI">
                <option value="DNI">DNI</option>
                <option value="CE">Carné de extranjería</option>
                <option value="PASAPORTE">Pasaporte</option>
                <option value="RUC">RUC</option>
              </select>
            </div>
            <div>
              <label className={label}>N.º de documento *</label>
              <input name="numero_documento" required className={field} />
            </div>

            <div>
              <label className={label}>Teléfono</label>
              <input name="telefono" className={field} />
            </div>
            <div>
              <label className={label}>Domicilio</label>
              <input name="domicilio" className={field} />
            </div>

            <div>
              <label className={label}>Tipo de bien</label>
              <select name="tipo_bien" className={field} defaultValue="producto">
                <option value="producto">Producto</option>
                <option value="servicio">Servicio</option>
              </select>
            </div>
            <div>
              <label className={label}>N.º de pedido (si aplica)</label>
              <input name="pedido_id" className={field} />
            </div>

            <div className="col-span-2">
              <label className={label}>
                Detalle del {"reclamo/queja"} *
              </label>
              <textarea
                name="detalle"
                required
                rows={4}
                className={field}
                placeholder="Describe lo ocurrido con el mayor detalle posible."
              />
            </div>
            <div className="col-span-2">
              <label className={label}>Tu pedido (qué solución esperas)</label>
              <textarea name="pedido_consumidor" rows={2} className={field} />
            </div>

            {estado === "error" && (
              <p className="col-span-2 text-sm text-red-400">{error}</p>
            )}

            <div className="col-span-2">
              <button
                type="submit"
                disabled={estado === "enviando"}
                className="rounded-lg bg-[--color-volt] px-6 py-2.5 text-sm font-semibold text-[--color-carbon] disabled:opacity-60"
              >
                {estado === "enviando" ? "Enviando…" : "Enviar hoja de reclamación"}
              </button>
            </div>
          </form>
        </div>

        <aside className="h-fit rounded-2xl border border-[--color-graphite] bg-[--color-surface] p-5 text-sm text-[--color-muted]">
          <h2 className="mb-2 font-display font-semibold text-[--color-ink]">
            ¿Cómo funciona?
          </h2>
          <ul className="list-disc space-y-2 pl-4">
            <li>Registra tu reclamo o queja con tus datos.</li>
            <li>Recibes un código de seguimiento.</li>
            <li>Respondemos a tu correo en máximo 15 días hábiles.</li>
          </ul>
          <p className="mt-4 border-t border-[--color-graphite] pt-4 text-xs">
            {COMPANY.razonSocial} · RUC {COMPANY.ruc}
            <br />
            {COMPANY.email}
          </p>
        </aside>
      </div>
    </div>
  );
}
