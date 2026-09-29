import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { EVENTS_MODULE } from "../../../modules/events";
import type EventsModuleService from "../../../modules/events/service";
import { getDemandRadar } from "../../../lib/intel";

/**
 * GET /admin/intel — datos del panel interno "Inteligencia CAVI":
 *  - proximos_eventos: de la agenda real (aprobados, futuros), con días
 *    restantes y ventana sugerida de compra.
 *  - radar: señales de demanda ("qué comprar"), internas o de Google Trends.
 *  - experimento: ficha del A/B activo (wa_advisory_v1) para seguimiento.
 */
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const service: EventsModuleService = req.scope.resolve(EVENTS_MODULE);

  const [eventos] = await service.listAndCountCaviEvents(
    { moderacion: "aprobado" },
    { order: { fecha_inicio: "ASC" }, take: 50 },
  );

  const now = Date.now();
  const DIA = 86_400_000;
  const proximos = (eventos as Array<Record<string, unknown>>)
    .map((e) => {
      const fecha = new Date(String(e.fecha_inicio));
      const dias = Math.ceil((fecha.getTime() - now) / DIA);
      return {
        id: e.id,
        titulo: e.titulo,
        disciplina: e.disciplina,
        departamento: e.departamento,
        fecha_inicio: e.fecha_inicio,
        dias_restantes: dias,
        // Ventana de compra: el atleta equipa/nutre 2–6 semanas antes.
        ventana_compra: dias <= 45 && dias >= 7,
      };
    })
    .filter((e) => e.dias_restantes >= 0)
    .slice(0, 12);

  const disciplinasProximas = [
    ...new Set(proximos.map((e) => String(e.disciplina))),
  ];

  const { signals, fuente } = await getDemandRadar({ disciplinasProximas });

  res.json({
    experimento: {
      id: "wa_advisory_v1",
      nombre: "CTA de asesoría WhatsApp proactivo",
      hipotesis:
        "Mostrar el CTA de asesoría de forma proactiva y contextual a sesiones de alta intención aumenta el clic cualificado a WhatsApp (≥20%) sin dañar la conversión.",
      variantes: ["control", "smart"],
      kpi_primario: "CTR de WhatsApp por variante",
      kpi_guardia: "Conversión (checkout/compra) por variante",
      lectura: "warehouse/queries/experimento_asesoria_whatsapp.sql",
      estado: "activo",
    },
    proximos_eventos: proximos,
    radar: { fuente, signals },
  });
}
