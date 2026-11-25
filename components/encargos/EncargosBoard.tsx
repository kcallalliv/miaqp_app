"use client";

import { useEffect, useMemo, useState } from "react";
import type { EncargoItem } from "@/lib/encargos/types";
import { EncargoCard } from "./EncargoCard";
import { track, EVENTS } from "@/lib/analytics";

export function EncargosBoard({ encargos }: { encargos: EncargoItem[] }) {
  const [cat, setCat] = useState<string>("todos");

  useEffect(() => {
    track(EVENTS.ENCARGO_VIEW, { value: encargos.length });
  }, [encargos.length]);

  const categorias = useMemo(
    () => ["todos", ...Array.from(new Set(encargos.map((e) => e.categoria)))],
    [encargos],
  );
  const visibles = cat === "todos" ? encargos : encargos.filter((e) => e.categoria === cat);

  return (
    <section className="container-cavi py-10">
      {/* Cómo funciona */}
      <div className="mb-8 grid gap-4 rounded-2xl border border-[--color-graphite] bg-[--color-surface] p-6 sm:grid-cols-3">
        {[
          { n: "1", t: "Eliges y reservas", d: "Mira los productos con cupo y reserva por WhatsApp." },
          { n: "2", t: "50% de adelanto", d: "Confirmas tu cupo con el 50%. Los traigo en mi viaje." },
          { n: "3", t: "50% al entregar", d: "Pagas el resto cuando recibes tu producto en Perú." },
        ].map((s) => (
          <div key={s.n} className="flex gap-3">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[--color-volt] text-sm font-bold text-[--color-carbon]">
              {s.n}
            </span>
            <div>
              <p className="font-display text-sm font-semibold text-[--color-ink]">{s.t}</p>
              <p className="text-xs text-[--color-muted]">{s.d}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div className="mb-6 flex flex-wrap gap-2">
        {categorias.map((c) => (
          <button
            key={c}
            onClick={() => {
              setCat(c);
              if (c !== "todos") track(EVENTS.EVENT_FILTER_USED, { community: c, source: "encargos" });
            }}
            className={`rounded-full border px-3 py-1 text-sm transition-colors ${
              cat === c
                ? "border-[--color-volt] bg-[--color-volt]/10 text-[--color-volt]"
                : "border-[--color-graphite] text-[--color-muted] hover:text-[--color-ink]"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {visibles.length === 0 ? (
        <p className="py-10 text-center text-sm text-[--color-muted]">
          No hay encargos en esta categoría por ahora.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visibles.map((e) => (
            <EncargoCard key={e.id} item={e} />
          ))}
        </div>
      )}

      <p className="mt-8 text-center text-xs text-[--color-muted]">
        Los precios incluyen comisión. Productos genuinos traídos bajo pedido. Nutrición
        sujeta a disponibilidad y normativa.
      </p>
    </section>
  );
}
