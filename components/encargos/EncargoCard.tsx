"use client";

import type { EncargoItem } from "@/lib/encargos/types";
import { formatPrice } from "@/lib/format";
import { whatsappUrl, encargoMessage } from "@/lib/whatsapp";
import { track, EVENTS } from "@/lib/analytics";

const fmtFecha = (iso?: string | null) =>
  iso ? new Intl.DateTimeFormat("es-PE", { day: "numeric", month: "short" }).format(new Date(iso)) : null;

export function EncargoCard({ item }: { item: EncargoItem }) {
  const ahorro =
    item.precio_peru_aprox && item.precio_peru_aprox > item.precio_final
      ? item.precio_peru_aprox - item.precio_final
      : null;
  const limite = fmtFecha(item.fecha_limite);

  const href = whatsappUrl(encargoMessage(item.titulo, formatPrice(item.precio_final)));

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-[--color-graphite] bg-[--color-surface]">
      <div className="relative aspect-[4/3] bg-[--color-surface-2]">
        {item.imagen_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.imagen_url} alt={item.titulo} className="h-full w-full object-cover" />
        ) : (
          <div className="grid h-full w-full place-items-center text-4xl opacity-40">✈️</div>
        )}
        <span className="absolute left-3 top-3 rounded-md bg-[--color-carbon]/80 px-2 py-1 text-[11px] font-medium text-[--color-muted]">
          {item.categoria}
        </span>
        {item.agotado ? (
          <span className="absolute right-3 top-3 rounded-md bg-red-500/90 px-2 py-1 text-[11px] font-bold text-white">
            Agotado
          </span>
        ) : (
          <span className="absolute right-3 top-3 rounded-md bg-[--color-volt] px-2 py-1 text-[11px] font-bold text-[--color-carbon]">
            {item.cupos_disponibles} de {item.cupos_total} cupos
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex-1">
          <p className="text-xs text-[--color-muted]">{item.marca}</p>
          <h3 className="font-display text-base font-semibold text-[--color-ink]">{item.titulo}</h3>
          {item.descripcion && (
            <p className="mt-1 line-clamp-2 text-xs text-[--color-muted]">{item.descripcion}</p>
          )}
        </div>

        <div className="mt-3 rounded-xl bg-[--color-surface-2] p-3 text-sm">
          <div className="flex items-baseline justify-between">
            <span className="text-[--color-muted]">Precio CAVI</span>
            <span className="font-display text-lg font-bold text-[--color-volt]">
              {formatPrice(item.precio_final)}
            </span>
          </div>
          <div className="mt-1 flex items-center justify-between text-xs text-[--color-muted]">
            <span>Incluye comisión {formatPrice(item.comision)}</span>
            {item.precio_peru_aprox ? (
              <span>
                acá: <s>{formatPrice(item.precio_peru_aprox)}</s>
              </span>
            ) : null}
          </div>
          {ahorro && (
            <p className="mt-1 text-xs font-medium text-[--color-volt]">
              Ahorras ~{formatPrice(ahorro)}
            </p>
          )}
        </div>

        {limite && !item.agotado && (
          <p className="mt-2 text-[11px] text-[--color-muted]">Reserva hasta el {limite}</p>
        )}

        <a
          href={item.agotado ? undefined : href}
          target="_blank"
          rel="noopener noreferrer"
          aria-disabled={item.agotado}
          onClick={() => {
            if (item.agotado) return;
            track(EVENTS.ENCARGO_RESERVE_CLICK, {
              productId: item.id,
              community: item.categoria,
              brand: item.marca ?? undefined,
              value: item.precio_final,
              source: "encargos",
            });
          }}
          className={`mt-3 rounded-lg px-4 py-2.5 text-center text-sm font-semibold ${
            item.agotado
              ? "cursor-not-allowed bg-[--color-graphite] text-[--color-muted]"
              : "bg-[--color-volt] text-[--color-carbon] hover:bg-[--color-volt-hover]"
          }`}
        >
          {item.agotado ? "Sin cupos" : "Reservar por WhatsApp"}
        </a>
      </div>
    </div>
  );
}
