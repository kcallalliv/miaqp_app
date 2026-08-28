"use client";

import { useState } from "react";
import { DEPARTAMENTOS, DISCIPLINA_LABEL } from "@/lib/events/types";
import type { Disciplina } from "@/lib/events/types";
import { BoltIcon } from "@/components/ui/icons";

const DISCIPLINAS: Disciplina[] = [
  "trail", "triatlon", "ruta", "aguas_abiertas", "ciclismo", "otro",
];

export function EventSubmitForm() {
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    titulo: "", disciplina: "trail", fecha_inicio: "", departamento: "Arequipa",
    ciudad: "", distancias: "", organizador: "", url_inscripcion: "",
  });

  function set<K extends keyof typeof form>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function submit() {
    setError(null);
    if (form.titulo.trim().length < 3 || !form.fecha_inicio) {
      setError("Completa al menos el título y la fecha.");
      return;
    }
    setSending(true);
    try {
      const res = await fetch("/api/events-submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "No se pudo enviar.");
      setDone(data.message || "¡Recibido! Lo revisaremos antes de publicarlo.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al enviar.");
    } finally {
      setSending(false);
    }
  }

  const input =
    "w-full rounded-lg border border-[--color-graphite] bg-[--color-surface] px-3 py-2 text-sm text-[--color-ink] outline-none placeholder:text-[--color-muted] focus:border-[--color-volt]";

  return (
    <div className="mt-8">
      {!open ? (
        <button onClick={() => setOpen(true)} className="btn-ghost">
          <BoltIcon className="h-4 w-4 text-[--color-volt]" />
          ¿Organizas una carrera? Publícala
        </button>
      ) : (
        <div className="card p-5">
          {done ? (
            <div className="text-center">
              <p className="font-display font-semibold text-[--color-volt]">
                {done}
              </p>
              <p className="mt-1 text-sm text-[--color-muted]">
                Publicamos solo tras revisión manual (anti-spam).
              </p>
            </div>
          ) : (
            <>
              <h4 className="font-display text-lg font-bold">
                Publica tu carrera
              </h4>
              <p className="mt-1 text-sm text-[--color-muted]">
                Enviaremos a revisión. Solo datos del evento + enlace oficial.
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <input className={`${input} sm:col-span-2`} placeholder="Título de la carrera *" value={form.titulo} onChange={(e) => set("titulo", e.target.value)} />
                <select className={input} value={form.disciplina} onChange={(e) => set("disciplina", e.target.value)}>
                  {DISCIPLINAS.map((d) => <option key={d} value={d}>{DISCIPLINA_LABEL[d]}</option>)}
                </select>
                <input className={input} type="date" value={form.fecha_inicio} onChange={(e) => set("fecha_inicio", e.target.value)} />
                <select className={input} value={form.departamento} onChange={(e) => set("departamento", e.target.value)}>
                  {DEPARTAMENTOS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
                <input className={input} placeholder="Ciudad / distrito" value={form.ciudad} onChange={(e) => set("ciudad", e.target.value)} />
                <input className={input} placeholder="Distancias (6K, 21K, 50K)" value={form.distancias} onChange={(e) => set("distancias", e.target.value)} />
                <input className={input} placeholder="Organizador" value={form.organizador} onChange={(e) => set("organizador", e.target.value)} />
                <input className={`${input} sm:col-span-2`} placeholder="URL de inscripción oficial" value={form.url_inscripcion} onChange={(e) => set("url_inscripcion", e.target.value)} />
              </div>
              {error && <p className="mt-3 text-sm text-[#FF9A9A]">{error}</p>}
              <div className="mt-4 flex gap-2">
                <button onClick={submit} disabled={sending} className="btn-volt disabled:opacity-60">
                  {sending ? "Enviando…" : "Enviar para revisión"}
                </button>
                <button onClick={() => setOpen(false)} className="btn-ghost">
                  Cancelar
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
