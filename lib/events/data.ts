import { medusaFetch, isMedusaEnabled } from "@/lib/medusa/client";
import type { EventItem } from "./types";

/** Ejemplos para modo demo (sin backend). Editables; solo hechos + enlace. */
function daysFromNow(d: number): string {
  const x = new Date();
  x.setHours(9, 0, 0, 0);
  x.setDate(x.getDate() + d);
  return x.toISOString();
}

const MOCK_EVENTS: EventItem[] = [
  { id: "ev-1", titulo: "Misti Ultra Summit", disciplina: "trail", departamento: "Arequipa", ciudad: "Arequipa · Volcán Misti", distancias: "21K, 42K, 50K", organizador: "Comunidad trail Arequipa", url_inscripcion: null, estado: "inscripciones_abiertas", destacado: true, fecha_inicio: daysFromNow(45) },
  { id: "ev-2", titulo: "Misti SkyRace", disciplina: "trail", departamento: "Arequipa", ciudad: "Arequipa · Altura", distancias: "Vertical, 28K", organizador: "SkyRunning Perú", url_inscripcion: null, estado: "proximo", destacado: true, fecha_inicio: daysFromNow(80) },
  { id: "ev-3", titulo: "Triatlón de Arequipa", disciplina: "triatlon", departamento: "Arequipa", ciudad: "Arequipa", distancias: "Sprint, Olímpico", organizador: "Fed. de Triatlón", url_inscripcion: null, estado: "proximo", destacado: false, fecha_inicio: daysFromNow(60) },
  { id: "ev-4", titulo: "Maratón de Lima 42K", disciplina: "ruta", departamento: "Lima", ciudad: "Lima", distancias: "10K, 21K, 42K", organizador: "Maratón Lima", url_inscripcion: null, estado: "inscripciones_abiertas", destacado: false, fecha_inicio: daysFromNow(30) },
  { id: "ev-5", titulo: "Aguas Abiertas Titicaca", disciplina: "aguas_abiertas", departamento: "Puno", ciudad: "Puno · Lago Titicaca", distancias: "1.5K, 3K", organizador: "Open Water Perú", url_inscripcion: null, estado: "proximo", destacado: false, fecha_inicio: daysFromNow(100) },
  { id: "ev-6", titulo: "Gran Fondo Colca", disciplina: "ciclismo", departamento: "Arequipa", ciudad: "Valle del Colca", distancias: "80K, 120K", organizador: "Ciclismo Colca", url_inscripcion: null, estado: "proximo", destacado: false, fecha_inicio: daysFromNow(70) },
  { id: "ev-7", titulo: "Trail Cusco Sacred Valley", disciplina: "trail", departamento: "Cusco", ciudad: "Valle Sagrado", distancias: "12K, 30K", organizador: "Andes Trail", url_inscripcion: null, estado: "proximo", destacado: false, fecha_inicio: daysFromNow(90) },
];

interface MedusaEventsResponse {
  events: EventItem[];
}

export interface Agenda {
  events: EventItem[];
  source: "medusa" | "mock";
}

/** Trae la agenda pública (próximos, aprobados) desde Medusa; fallback a mock. */
export async function getEvents(): Promise<Agenda> {
  if (!isMedusaEnabled()) return { events: MOCK_EVENTS, source: "mock" };

  const data = await medusaFetch<MedusaEventsResponse>("/store/events", {
    all: 1,
  });
  if (!data || !Array.isArray(data.events) || data.events.length === 0) {
    return { events: MOCK_EVENTS, source: "mock" };
  }
  return { events: data.events, source: "medusa" };
}
