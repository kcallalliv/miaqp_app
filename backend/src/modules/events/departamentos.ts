/** 24 departamentos del Perú + Callao (Provincia Constitucional). */
export const DEPARTAMENTOS = [
  "Amazonas",
  "Áncash",
  "Apurímac",
  "Arequipa",
  "Ayacucho",
  "Cajamarca",
  "Callao",
  "Cusco",
  "Huancavelica",
  "Huánuco",
  "Ica",
  "Junín",
  "La Libertad",
  "Lambayeque",
  "Lima",
  "Loreto",
  "Madre de Dios",
  "Moquegua",
  "Pasco",
  "Piura",
  "Puno",
  "San Martín",
  "Tacna",
  "Tumbes",
  "Ucayali",
] as const;

export type Departamento = (typeof DEPARTAMENTOS)[number];

export const DISCIPLINAS = [
  "trail",
  "triatlon",
  "ruta",
  "aguas_abiertas",
  "ciclismo",
  "otro",
] as const;

export const ESTADOS = [
  "proximo",
  "inscripciones_abiertas",
  "agotado",
  "finalizado",
] as const;

/** Estado de moderación (para el formulario público). */
export const MODERACION = ["aprobado", "pendiente", "rechazado"] as const;
