import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { ENCARGOS_MODULE } from "../../../modules/encargos";
import type EncargosModuleService from "../../../modules/encargos/service";

/**
 * GET /store/encargos — encargos activos (público).
 * Devuelve cupos disponibles y si está agotado, ya calculados.
 */
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const service: EncargosModuleService = req.scope.resolve(ENCARGOS_MODULE);
  const { categoria } = req.query;
  const filters: Record<string, unknown> = { activo: true };
  if (categoria) filters.categoria = categoria;

  const [items] = await service.listAndCountCaviEncargoItems(filters, {
    order: { destacado: "DESC", created_at: "DESC" },
    take: 100,
  });

  const encargos = (items as Array<Record<string, unknown>>).map((e) => {
    const total = Number(e.cupos_total ?? 0);
    const reservados = Number(e.cupos_reservados ?? 0);
    const disponibles = Math.max(0, total - reservados);
    return {
      id: e.id,
      titulo: e.titulo,
      categoria: e.categoria,
      marca: e.marca,
      descripcion: e.descripcion,
      imagen_url: e.imagen_url,
      precio_usa: e.precio_usa,
      precio_peru_aprox: e.precio_peru_aprox,
      comision: e.comision,
      precio_final: e.precio_final,
      cupos_total: total,
      cupos_disponibles: disponibles,
      agotado: disponibles <= 0,
      fecha_limite: e.fecha_limite,
      destacado: e.destacado,
    };
  });

  res.json({ encargos });
}
