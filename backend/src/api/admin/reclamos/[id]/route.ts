import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { RECLAMOS_MODULE } from "../../../../modules/reclamos";
import type ReclamosModuleService from "../../../../modules/reclamos/service";

/** POST /admin/reclamos/:id — registrar respuesta / cambiar estado. */
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const service: ReclamosModuleService = req.scope.resolve(RECLAMOS_MODULE);
  const { id } = req.params;
  const b = (req.body ?? {}) as Record<string, unknown>;

  const update: Record<string, unknown> = { id };
  if (typeof b.respuesta === "string") {
    update.respuesta = b.respuesta.slice(0, 4000);
    update.estado = "respondido";
    update.respondido_at = new Date();
  }
  if (b.estado === "pendiente" || b.estado === "respondido") {
    update.estado = b.estado;
  }

  const [reclamo] = await service.updateCaviReclamoes([update]);
  res.json({ reclamo });
}
