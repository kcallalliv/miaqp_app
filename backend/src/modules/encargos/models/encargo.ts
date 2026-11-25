import { model } from "@medusajs/framework/utils";
import { CATEGORIAS_ENCARGO } from "../constants";

/**
 * Entidad Encargo: producto que CAVI trae por encargo desde un viaje (USA).
 * Cupos limitados, comisión visible y reserva por WhatsApp (50% adelanto /
 * 50% contra entrega). Montos en enteros: USD para `precio_usa`, PEN para el
 * resto.
 */
export const CaviEncargoItem = model
  .define("cavi_encargo", {
    id: model.id().primaryKey(),
    titulo: model.text().searchable(),
    categoria: model.enum([...CATEGORIAS_ENCARGO]).default("otro"),
    marca: model.text().nullable(),
    descripcion: model.text().nullable(),
    imagen_url: model.text().nullable(),
    // Precios (enteros). precio_usa en USD; el resto en PEN.
    precio_usa: model.number().default(0),
    precio_peru_aprox: model.number().nullable(), // referencia: a cuánto se consigue acá
    comision: model.number().default(0), // comisión de CAVI (PEN)
    precio_final: model.number().default(0), // lo que paga el cliente (PEN, total)
    // Cupos
    cupos_total: model.number().default(1),
    cupos_reservados: model.number().default(0),
    // Reserva hasta (antes del viaje)
    fecha_limite: model.dateTime().nullable(),
    destacado: model.boolean().default(false),
    activo: model.boolean().default(true),
  })
  .indexes([{ on: ["categoria"] }, { on: ["activo"] }]);
