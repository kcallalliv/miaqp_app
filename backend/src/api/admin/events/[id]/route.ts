import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { EVENTS_MODULE } from "../../../../modules/events";
import type EventsModuleService from "../../../../modules/events/service";

/** POST /admin/events/:id — actualiza (editar / publicar / aprobar). */
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const service: EventsModuleService = req.scope.resolve(EVENTS_MODULE);
  const { id } = req.params;
  const b = (req.body ?? {}) as Record<string, unknown>;
  const update: Record<string, unknown> = { id, ...b };
  if (b.fecha_inicio) update.fecha_inicio = new Date(String(b.fecha_inicio));
  if (b.fecha_fin) update.fecha_fin = new Date(String(b.fecha_fin));
  const event = await service.updateCaviEvents(update);
  res.json({ event });
}

/** DELETE /admin/events/:id */
export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  const service: EventsModuleService = req.scope.resolve(EVENTS_MODULE);
  const { id } = req.params;
  await service.deleteCaviEvents(id);
  res.json({ id, deleted: true });
}
