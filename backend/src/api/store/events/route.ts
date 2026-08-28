import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { EVENTS_MODULE } from "../../../modules/events";
import type EventsModuleService from "../../../modules/events/service";

/**
 * GET /store/events — agenda pública (solo eventos aprobados).
 * Query: ?departamento=Arequipa&disciplina=trail&all=1
 * Por defecto muestra solo próximos (fecha_inicio >= hoy) ordenados por fecha.
 */
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const service: EventsModuleService = req.scope.resolve(EVENTS_MODULE);

  const { departamento, disciplina, all } = req.query;
  const filters: Record<string, unknown> = { moderacion: "aprobado" };
  if (typeof departamento === "string" && departamento)
    filters.departamento = departamento;
  if (typeof disciplina === "string" && disciplina)
    filters.disciplina = disciplina;
  if (!all) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    filters.fecha_inicio = { $gte: today };
  }

  const events = await service.listCaviEvents(filters, {
    order: { fecha_inicio: "ASC" },
    take: 100,
  });

  res.json({ events });
}
