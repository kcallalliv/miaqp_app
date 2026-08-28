import { model } from "@medusajs/framework/utils";
import {
  DEPARTAMENTOS,
  DISCIPLINAS,
  ESTADOS,
  MODERACION,
} from "../departamentos";

/**
 * Entidad Event: agenda curada de carreras de endurance en Perú.
 * Solo hechos del evento (fecha, lugar, distancias, organizador) + enlace a la
 * inscripción oficial. Indexada por departamento, disciplina y fecha.
 */
export const CaviEvent = model
  .define("cavi_event", {
    id: model.id().primaryKey(),
    titulo: model.text().searchable(),
    disciplina: model.enum([...DISCIPLINAS]).default("otro"),
    fecha_inicio: model.dateTime(),
    fecha_fin: model.dateTime().nullable(),
    departamento: model.enum([...DEPARTAMENTOS]),
    ciudad: model.text().nullable(),
    distancias: model.text().nullable(),
    organizador: model.text().nullable(),
    url_inscripcion: model.text().nullable(),
    imagen_url: model.text().nullable(),
    fuente: model.text().nullable(),
    estado: model.enum([...ESTADOS]).default("proximo"),
    destacado: model.boolean().default(false),
    // Moderación: los envíos públicos entran como "pendiente" (no visibles).
    moderacion: model.enum([...MODERACION]).default("aprobado"),
  })
  .indexes([
    { on: ["departamento"] },
    { on: ["disciplina"] },
    { on: ["fecha_inicio"] },
  ]);
