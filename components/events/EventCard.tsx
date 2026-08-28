"use client";

import { useEffect, useState } from "react";
import type { EventItem } from "@/lib/events/types";
import {
  DISCIPLINA_LABEL,
  DISCIPLINA_ACCENT,
  ESTADO_LABEL,
  formatEventDate,
} from "@/lib/events/types";
import { whatsappUrl } from "@/lib/whatsapp";
import { track, EVENTS } from "@/lib/analytics";
import { WhatsAppIcon, ArrowRightIcon, HeartIcon, BoltIcon } from "@/components/ui/icons";

const SAVED_KEY = "cavi.savedEvents";

function readSaved(): string[] {
  try {
    return JSON.parse(localStorage.getItem(SAVED_KEY) || "[]");
  } catch {
    return [];
  }
}

export function EventCard({ event }: { event: EventItem }) {
  const accent = DISCIPLINA_ACCENT[event.disciplina];
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(readSaved().includes(event.id));
  }, [event.id]);

  function toggleSave() {
    const list = readSaved();
    const next = list.includes(event.id)
      ? list.filter((x) => x !== event.id)
      : [...list, event.id];
    try {
      localStorage.setItem(SAVED_KEY, JSON.stringify(next));
    } catch {
      /* almacenamiento no disponible */
    }
    setSaved(next.includes(event.id));
  }

  function onInscribir() {
    track(EVENTS.INSCRIPTION_CLICK, {
      eventId: event.id,
      community: event.disciplina,
      departamento: event.departamento,
    });
  }

  const shareText = `🏁 ${event.titulo} · ${formatEventDate(event.fecha_inicio)} · ${
    event.ciudad || event.departamento
  }${event.url_inscripcion ? ` · Inscripción: ${event.url_inscripcion}` : ""} — vía CAVI STORE`;

  function onShare() {
    track(EVENTS.EVENT_SHARE, {
      eventId: event.id,
      community: event.disciplina,
      departamento: event.departamento,
    });
  }

  return (
    <article className="card flex flex-col overflow-hidden">
      {/* Cabecera con disciplina y estado */}
      <div
        className="relative flex items-center justify-between p-4"
        style={{
          background: `linear-gradient(120deg, ${accent}1f, transparent)`,
        }}
      >
        <span
          className="metric-chip rounded-full border px-2 py-0.5"
          style={{ borderColor: `${accent}66`, color: accent }}
        >
          {DISCIPLINA_LABEL[event.disciplina]}
        </span>
        <span className="text-[11px] font-semibold uppercase tracking-wide text-[--color-muted]">
          {ESTADO_LABEL[event.estado]}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4 pt-2">
        <h4 className="font-display text-base font-bold leading-tight text-[--color-ink]">
          {event.titulo}
        </h4>
        <p className="mt-1 text-sm text-[--color-volt]">
          {formatEventDate(event.fecha_inicio)}
        </p>
        <p className="mt-0.5 text-sm text-[--color-muted]">
          {event.ciudad ? `${event.ciudad} · ` : ""}
          {event.departamento}
        </p>
        {event.distancias && (
          <p className="mt-1 text-xs text-[--color-muted]">
            Distancias: {event.distancias}
          </p>
        )}
        {event.organizador && (
          <p className="mt-0.5 text-xs text-[--color-muted]">
            Organiza: {event.organizador}
          </p>
        )}

        {/* Cross-sell de fueling */}
        <a
          href="#nutricion"
          className="mt-3 flex items-center gap-2 rounded-lg border border-[--color-graphite] bg-[--color-anthracite] px-3 py-2 text-xs text-[--color-muted] transition-colors hover:border-[--color-volt]/40 hover:text-[--color-ink]"
        >
          <BoltIcon className="h-3.5 w-3.5 text-[--color-volt]" />
          Prepara tu fueling para esta carrera
          <ArrowRightIcon className="ml-auto h-3.5 w-3.5" />
        </a>

        {/* Acciones */}
        <div className="mt-4 flex flex-col gap-2">
          {event.url_inscripcion ? (
            <a
              href={event.url_inscripcion}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onInscribir}
              className="btn-volt w-full text-sm"
            >
              Inscribirme <ArrowRightIcon className="h-4 w-4" />
            </a>
          ) : (
            <span className="w-full rounded-lg border border-[--color-graphite] px-4 py-2 text-center text-sm text-[--color-muted]">
              Inscripción por confirmar
            </span>
          )}
          <div className="flex gap-2">
            <a
              href={whatsappUrl(shareText)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onShare}
              className="btn-ghost flex-1 text-sm"
            >
              <WhatsAppIcon className="h-4 w-4 text-[--color-volt]" />
              Compartir
            </a>
            <button
              onClick={toggleSave}
              aria-pressed={saved}
              className={`btn-ghost text-sm ${saved ? "border-[--color-volt] text-[--color-volt]" : ""}`}
              title={saved ? "Guardado" : "Recuérdamelo"}
            >
              <HeartIcon className="h-4 w-4" />
              {saved ? "Guardado" : "Guardar"}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
