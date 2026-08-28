export const DEPARTAMENTOS = [
  "Amazonas", "Áncash", "Apurímac", "Arequipa", "Ayacucho", "Cajamarca",
  "Callao", "Cusco", "Huancavelica", "Huánuco", "Ica", "Junín", "La Libertad",
  "Lambayeque", "Lima", "Loreto", "Madre de Dios", "Moquegua", "Pasco",
  "Piura", "Puno", "San Martín", "Tacna", "Tumbes", "Ucayali",
] as const;

export type Departamento = (typeof DEPARTAMENTOS)[number];

export type Disciplina =
  | "trail" | "triatlon" | "ruta" | "aguas_abiertas" | "ciclismo" | "otro";

export type EstadoEvento =
  | "proximo" | "inscripciones_abiertas" | "agotado" | "finalizado";

export const DISCIPLINA_LABEL: Record<Disciplina, string> = {
  trail: "Trail",
  triatlon: "Triatlón",
  ruta: "Ruta",
  aguas_abiertas: "Aguas abiertas",
  ciclismo: "Ciclismo",
  otro: "Otro",
};

export const ESTADO_LABEL: Record<EstadoEvento, string> = {
  proximo: "Próximo",
  inscripciones_abiertas: "Inscripciones abiertas",
  agotado: "Agotado",
  finalizado: "Finalizado",
};

export const DISCIPLINA_ACCENT: Record<Disciplina, string> = {
  trail: "#FF7A45",
  triatlon: "#38D9C7",
  ruta: "#5C7CFA",
  aguas_abiertas: "#4DABF7",
  ciclismo: "#DA77F2",
  otro: "#A7ADB2",
};

export interface EventItem {
  id: string;
  titulo: string;
  disciplina: Disciplina;
  fecha_inicio: string; // ISO
  fecha_fin?: string | null;
  departamento: Departamento;
  ciudad?: string | null;
  distancias?: string | null;
  organizador?: string | null;
  url_inscripcion?: string | null;
  imagen_url?: string | null;
  estado: EstadoEvento;
  destacado: boolean;
}

/** Fecha legible en español (Perú). */
export function formatEventDate(iso: string): string {
  const d = new Date(iso);
  return new Intl.DateTimeFormat("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(d);
}
