/** Libro de Reclamaciones (D.S. 011-2011-PCM / Código de Protección al
 *  Consumidor, Perú). Constantes del dominio. */

/** Reclamo: disconformidad con el producto/servicio. Queja: malestar con la
 *  atención, no relacionado directamente al producto. */
export const TIPOS_RECLAMO = ["reclamo", "queja"] as const;

export const TIPOS_BIEN = ["producto", "servicio"] as const;

export const TIPOS_DOCUMENTO = ["DNI", "CE", "PASAPORTE", "RUC"] as const;

/** Estado interno de gestión (la ley exige respuesta en <= 15 días hábiles). */
export const ESTADOS_RECLAMO = ["pendiente", "respondido"] as const;

export type TipoReclamo = (typeof TIPOS_RECLAMO)[number];
export type TipoBien = (typeof TIPOS_BIEN)[number];
export type TipoDocumento = (typeof TIPOS_DOCUMENTO)[number];
export type EstadoReclamo = (typeof ESTADOS_RECLAMO)[number];
