import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { ENCARGOS_MODULE } from "../../../modules/encargos";
import type EncargosModuleService from "../../../modules/encargos/service";

/** GET /admin/encargos — lista todos (incluye inactivos). */
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const service: EncargosModuleService = req.scope.resolve(ENCARGOS_MODULE);
  const [encargos, count] = await service.listAndCountCaviEncargoItems(
    {},
    { order: { created_at: "DESC" }, take: 200 },
  );
  res.json({ encargos, count });
}

/** POST /admin/encargos — crea un encargo. */
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const service: EncargosModuleService = req.scope.resolve(ENCARGOS_MODULE);
  const b = (req.body ?? {}) as Record<string, unknown>;
  const num = (v: unknown, d = 0) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : d;
  };

  const [encargo] = await service.createCaviEncargoItems([
    {
      titulo: String(b.titulo ?? "").trim(),
      categoria: (b.categoria as string) ?? "otro",
      marca: b.marca ? String(b.marca) : null,
      descripcion: b.descripcion ? String(b.descripcion) : null,
      imagen_url: b.imagen_url ? String(b.imagen_url) : null,
      precio_usa: num(b.precio_usa),
      precio_peru_aprox: b.precio_peru_aprox != null ? num(b.precio_peru_aprox) : null,
      comision: num(b.comision),
      precio_final: num(b.precio_final),
      cupos_total: num(b.cupos_total, 1),
      cupos_reservados: num(b.cupos_reservados, 0),
      fecha_limite: b.fecha_limite ? new Date(String(b.fecha_limite)) : null,
      destacado: Boolean(b.destacado),
      activo: b.activo != null ? Boolean(b.activo) : true,
    },
  ]);
  res.status(201).json({ encargo });
}
