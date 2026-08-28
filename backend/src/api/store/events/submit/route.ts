import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { EVENTS_MODULE } from "../../../../modules/events";
import type EventsModuleService from "../../../../modules/events/service";
import {
  DEPARTAMENTOS,
  DISCIPLINAS,
} from "../../../../modules/events/departamentos";

/**
 * POST /store/events/submit — formulario público "¿Organizas una carrera?".
 * Crea el evento en moderación "pendiente" (NUNCA visible hasta aprobación).
 */
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const service: EventsModuleService = req.scope.resolve(EVENTS_MODULE);
  const b = (req.body ?? {}) as Record<string, unknown>;

  const titulo = String(b.titulo ?? "").trim();
  const departamento = String(b.departamento ?? "").trim();
  const disciplina = String(b.disciplina ?? "otro").trim();
  const fecha = String(b.fecha_inicio ?? "").trim();

  if (titulo.length < 3 || titulo.length > 160) {
    return res.status(400).json({ error: "Título inválido." });
  }
  if (!(DEPARTAMENTOS as readonly string[]).includes(departamento)) {
    return res.status(400).json({ error: "Departamento inválido." });
  }
  if (!(DISCIPLINAS as readonly string[]).includes(disciplina)) {
    return res.status(400).json({ error: "Disciplina inválida." });
  }
  const fechaInicio = new Date(fecha);
  if (Number.isNaN(fechaInicio.getTime())) {
    return res.status(400).json({ error: "Fecha inválida." });
  }

  await service.createCaviEvents([
    {
      titulo,
      departamento,
      disciplina,
      fecha_inicio: fechaInicio,
      ciudad: b.ciudad ? String(b.ciudad).slice(0, 120) : null,
      distancias: b.distancias ? String(b.distancias).slice(0, 120) : null,
      organizador: b.organizador ? String(b.organizador).slice(0, 160) : null,
      url_inscripcion: b.url_inscripcion
        ? String(b.url_inscripcion).slice(0, 400)
        : null,
      fuente: "formulario_publico",
      estado: "proximo",
      destacado: false,
      moderacion: "pendiente", // requiere aprobación manual
    },
  ]);

  res.status(201).json({
    ok: true,
    message: "Recibido. Lo revisaremos antes de publicarlo. ¡Gracias!",
  });
}
