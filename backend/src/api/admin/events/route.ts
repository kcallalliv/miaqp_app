import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { EVENTS_MODULE } from "../../../modules/events";
import type EventsModuleService from "../../../modules/events/service";

/** GET /admin/events — lista TODOS los eventos (incluye pendientes). */
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const service: EventsModuleService = req.scope.resolve(EVENTS_MODULE);
  const { moderacion, departamento, disciplina } = req.query;
  const filters: Record<string, unknown> = {};
  if (moderacion) filters.moderacion = moderacion;
  if (departamento) filters.departamento = departamento;
  if (disciplina) filters.disciplina = disciplina;

  const [events, count] = await service.listAndCountCaviEvents(filters, {
    order: { fecha_inicio: "ASC" },
    take: 200,
  });
  res.json({ events, count });
}

/** POST /admin/events — crea un evento (curación manual). */
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const service: EventsModuleService = req.scope.resolve(EVENTS_MODULE);
  const b = (req.body ?? {}) as Record<string, unknown>;
  const [event] = await service.createCaviEvents([
    {
      ...b,
      fecha_inicio: b.fecha_inicio ? new Date(String(b.fecha_inicio)) : new Date(),
      fecha_fin: b.fecha_fin ? new Date(String(b.fecha_fin)) : null,
      moderacion: (b.moderacion as string) ?? "aprobado",
    },
  ]);
  res.status(201).json({ event });
}
