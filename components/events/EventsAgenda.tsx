"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { EventItem, Disciplina } from "@/lib/events/types";
import { DEPARTAMENTOS, DISCIPLINA_LABEL } from "@/lib/events/types";
import { EventCard } from "./EventCard";
import { EventSubmitForm } from "./EventSubmitForm";
import { track, EVENTS } from "@/lib/analytics";
import { cn } from "@/lib/utils";

const DEFAULT_DEP = "Arequipa"; // fallback "cerca de ti"

const DISCIPLINAS: (Disciplina | "all")[] = [
  "all", "trail", "triatlon", "ruta", "aguas_abiertas", "ciclismo", "otro",
];

export function EventsAgenda({
  events,
  demo,
}: {
  events: EventItem[];
  demo?: boolean;
}) {
  const [departamento, setDepartamento] = useState<string>(DEFAULT_DEP);
  const [disciplina, setDisciplina] = useState<Disciplina | "all">("all");

  // Analítica: vista de la agenda (una vez).
  const viewed = useRef(false);
  useEffect(() => {
    if (!viewed.current) {
      viewed.current = true;
      track(EVENTS.EVENT_VIEW, { quantity: events.length });
    }
  }, [events.length]);

  function changeDep(v: string) {
    setDepartamento(v);
    track(EVENTS.EVENT_FILTER_USED, { departamento: v, community: disciplina });
  }
  function changeDisc(v: Disciplina | "all") {
    setDisciplina(v);
    track(EVENTS.EVENT_FILTER_USED, { departamento, community: v });
  }

  const filtered = useMemo(() => {
    return events
      .filter((e) => departamento === "all" || e.departamento === departamento)
      .filter((e) => disciplina === "all" || e.disciplina === disciplina)
      .sort((a, b) => +new Date(a.fecha_inicio) - +new Date(b.fecha_inicio));
  }, [events, departamento, disciplina]);

  const featured = filtered.filter((e) => e.destacado);
  const rest = filtered.filter((e) => !e.destacado);

  const select =
    "rounded-lg border border-[--color-graphite] bg-[--color-surface] px-3 py-2 text-sm text-[--color-ink] outline-none focus:border-[--color-volt]";

  return (
    <div className="mt-10">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h3 className="font-display text-2xl font-bold">Agenda de carreras</h3>
          <p className="mt-1 text-sm text-[--color-muted]">
            {departamento === DEFAULT_DEP
              ? "Eventos cerca de ti"
              : departamento === "all"
                ? "Todo el Perú"
                : `Eventos en ${departamento}`}{" "}
            · {filtered.length} evento{filtered.length === 1 ? "" : "s"}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => changeDep(departamento === "all" ? DEFAULT_DEP : "all")}
            className={cn(
              "rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
              departamento === "all"
                ? "border-[--color-graphite] text-[--color-muted] hover:text-[--color-ink]"
                : "border-[--color-volt] text-[--color-volt]",
            )}
          >
            {departamento === "all" ? "Cerca de ti" : "Ver todo el Perú"}
          </button>
          <select value={departamento} onChange={(e) => changeDep(e.target.value)} className={select}>
            <option value="all">Todo el Perú</option>
            {DEPARTAMENTOS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          <select
            value={disciplina}
            onChange={(e) => changeDisc(e.target.value as Disciplina | "all")}
            className={select}
          >
            <option value="all">Todas las disciplinas</option>
            {DISCIPLINAS.filter((d) => d !== "all").map((d) => (
              <option key={d} value={d}>{DISCIPLINA_LABEL[d as Disciplina]}</option>
            ))}
          </select>
        </div>
      </div>

      {demo && (
        <p className="mt-4 inline-flex items-center gap-2 rounded-lg border border-[--color-graphite] bg-[--color-anthracite] px-3 py-1.5 text-xs text-[--color-muted]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#FFD43B]" />
          Agenda de ejemplo · el equipo carga eventos reales desde el admin
        </p>
      )}

      {/* Destacados */}
      {featured.length > 0 && (
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {featured.map((e) => (
            <div key={e.id} className="rounded-2xl p-[1px]" style={{ background: "linear-gradient(120deg, #B8FF32, transparent)" }}>
              <EventCard event={e} />
            </div>
          ))}
        </div>
      )}

      {/* Resto */}
      {rest.length > 0 ? (
        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((e) => (
            <EventCard key={e.id} event={e} />
          ))}
        </div>
      ) : featured.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-[--color-graphite] p-8 text-center">
          <p className="text-[--color-ink]">
            Aún no hay eventos en{" "}
            <strong>{departamento === "all" ? "Perú" : departamento}</strong>
            {disciplina !== "all" ? ` de ${DISCIPLINA_LABEL[disciplina]}` : ""}.
          </p>
          <p className="mt-1 text-sm text-[--color-muted]">
            ¿Conoces una carrera? Avísanos y la publicamos.
          </p>
        </div>
      ) : null}

      {/* Formulario público */}
      <EventSubmitForm />
    </div>
  );
}
