import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { ENCARGOS_MODULE } from "../../../../modules/encargos";
import type EncargosModuleService from "../../../../modules/encargos/service";

/** POST /admin/encargos/:id — actualiza (cupos, precios, activo, etc.). */
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const service: EncargosModuleService = req.scope.resolve(ENCARGOS_MODULE);
  const { id } = req.params;
  const b = (req.body ?? {}) as Record<string, unknown>;

  const update: Record<string, unknown> = { id };
  const numFields = [
    "precio_usa",
    "precio_peru_aprox",
    "comision",
    "precio_final",
    "cupos_total",
    "cupos_reservados",
  ];
  for (const f of numFields) {
    if (b[f] != null) {
      const n = Number(b[f]);
      if (Number.isFinite(n)) update[f] = n;
    }
  }
  for (const f of ["titulo", "categoria", "marca", "descripcion", "imagen_url"]) {
    if (b[f] != null) update[f] = String(b[f]);
  }
  if (b.fecha_limite != null)
    update.fecha_limite = b.fecha_limite ? new Date(String(b.fecha_limite)) : null;
  if (b.destacado != null) update.destacado = Boolean(b.destacado);
  if (b.activo != null) update.activo = Boolean(b.activo);

  const [encargo] = await service.updateCaviEncargoItems([update]);
  res.json({ encargo });
}

/** DELETE /admin/encargos/:id */
export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  const service: EncargosModuleService = req.scope.resolve(ENCARGOS_MODULE);
  await service.deleteCaviEncargoItems(req.params.id);
  res.json({ id: req.params.id, deleted: true });
}
