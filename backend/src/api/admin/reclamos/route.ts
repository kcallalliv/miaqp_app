import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { RECLAMOS_MODULE } from "../../../modules/reclamos";
import type ReclamosModuleService from "../../../modules/reclamos/service";

/** GET /admin/reclamos — lista las hojas del Libro de Reclamaciones. */
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const service: ReclamosModuleService = req.scope.resolve(RECLAMOS_MODULE);
  const { estado } = req.query;
  const filters: Record<string, unknown> = {};
  if (estado) filters.estado = estado;

  const [reclamos, count] = await service.listAndCountCaviReclamoes(filters, {
    order: { created_at: "DESC" },
    take: 200,
  });
  res.json({ reclamos, count });
}
