import { model } from "@medusajs/framework/utils";
import {
  TIPOS_RECLAMO,
  TIPOS_BIEN,
  TIPOS_DOCUMENTO,
  ESTADOS_RECLAMO,
} from "../constants";

/**
 * Entidad Reclamo: hoja del Libro de Reclamaciones digital (Perú).
 * Guarda los datos del consumidor, el detalle del reclamo/queja y la gestión
 * interna (estado + respuesta). El `correlativo` identifica la hoja.
 */
export const CaviReclamo = model
  .define("cavi_reclamo", {
    id: model.id().primaryKey(),
    correlativo: model.text().unique(),
    tipo: model.enum([...TIPOS_RECLAMO]).default("reclamo"),
    tipo_bien: model.enum([...TIPOS_BIEN]).default("producto"),
    // Consumidor reclamante
    nombre: model.text(),
    tipo_documento: model.enum([...TIPOS_DOCUMENTO]).default("DNI"),
    numero_documento: model.text(),
    email: model.text(),
    telefono: model.text().nullable(),
    domicilio: model.text().nullable(),
    // Detalle
    pedido_id: model.text().nullable(),
    monto_reclamado: model.number().nullable(),
    descripcion_bien: model.text().nullable(),
    detalle: model.text(),
    pedido_consumidor: model.text().nullable(),
    // Gestión interna
    estado: model.enum([...ESTADOS_RECLAMO]).default("pendiente"),
    respuesta: model.text().nullable(),
    respondido_at: model.dateTime().nullable(),
  })
  .indexes([{ on: ["estado"] }, { on: ["numero_documento"] }]);
