import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { Modules } from "@medusajs/framework/utils";
import { RECLAMOS_MODULE } from "../../../modules/reclamos";
import type ReclamosModuleService from "../../../modules/reclamos/service";
import {
  TIPOS_RECLAMO,
  TIPOS_BIEN,
  TIPOS_DOCUMENTO,
} from "../../../modules/reclamos/constants";
import { reclamoAckEmail } from "../../../lib/email-templates";

const s = (v: unknown, max: number) => String(v ?? "").trim().slice(0, max);
const inList = (v: string, list: readonly string[]) => list.includes(v);

/** Genera un correlativo legible: CAVI-AAAAMMDD-XXXX. */
function correlativo(): string {
  const d = new Date();
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(
    d.getDate(),
  ).padStart(2, "0")}`;
  const rnd = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `CAVI-${ymd}-${rnd}`;
}

/**
 * POST /store/reclamos — hoja del Libro de Reclamaciones (público).
 * Valida y persiste el reclamo/queja en estado "pendiente".
 */
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const service: ReclamosModuleService = req.scope.resolve(RECLAMOS_MODULE);
  const b = (req.body ?? {}) as Record<string, unknown>;

  const tipo = s(b.tipo, 20) || "reclamo";
  const tipo_bien = s(b.tipo_bien, 20) || "producto";
  const tipo_documento = s(b.tipo_documento, 20) || "DNI";
  const nombre = s(b.nombre, 160);
  const numero_documento = s(b.numero_documento, 20);
  const email = s(b.email, 160);
  const detalle = s(b.detalle, 2000);

  if (!inList(tipo, TIPOS_RECLAMO))
    return res.status(400).json({ error: "Tipo inválido." });
  if (!inList(tipo_bien, TIPOS_BIEN))
    return res.status(400).json({ error: "Tipo de bien inválido." });
  if (!inList(tipo_documento, TIPOS_DOCUMENTO))
    return res.status(400).json({ error: "Tipo de documento inválido." });
  if (nombre.length < 3)
    return res.status(400).json({ error: "Nombre inválido." });
  if (numero_documento.length < 6)
    return res.status(400).json({ error: "Documento inválido." });
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))
    return res.status(400).json({ error: "Correo inválido." });
  if (detalle.length < 10)
    return res.status(400).json({ error: "Detalla tu reclamo (mín. 10 caracteres)." });

  const montoRaw = Number(b.monto_reclamado);
  const numero = correlativo();

  await service.createCaviReclamoes([
    {
      correlativo: numero,
      tipo,
      tipo_bien,
      nombre,
      tipo_documento,
      numero_documento,
      email,
      telefono: b.telefono ? s(b.telefono, 30) : null,
      domicilio: b.domicilio ? s(b.domicilio, 240) : null,
      pedido_id: b.pedido_id ? s(b.pedido_id, 60) : null,
      monto_reclamado: Number.isFinite(montoRaw) && montoRaw > 0 ? montoRaw : null,
      descripcion_bien: b.descripcion_bien ? s(b.descripcion_bien, 400) : null,
      detalle,
      pedido_consumidor: b.pedido_consumidor ? s(b.pedido_consumidor, 1000) : null,
      estado: "pendiente",
    },
  ]);

  // Acuse por correo (no bloquea el registro si el email falla).
  try {
    const notificationService = req.scope.resolve(Modules.NOTIFICATION);
    const { subject, html } = reclamoAckEmail(numero, nombre);
    await notificationService.createNotifications({
      to: email,
      channel: "email",
      template: "reclamo-ack",
      content: { subject, html },
    });
  } catch {
    // ignorar: el reclamo ya quedó registrado
  }

  res.status(201).json({
    ok: true,
    correlativo: numero,
    message:
      "Tu hoja fue registrada. Te responderemos por correo dentro del plazo de ley (15 días hábiles).",
  });
}
