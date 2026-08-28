import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { EVENTS_MODULE } from "../../../modules/events";
import type EventsModuleService from "../../../modules/events/service";
import {
  DEPARTAMENTOS,
  DISCIPLINAS,
  ESTADOS,
} from "../../../modules/events/departamentos";

/**
 * POST /hooks/events-sync — sincroniza la agenda desde una hoja externa
 * (Google Sheet publicado como CSV). Idempotente: upsert por titulo+fecha.
 *
 * Protegido por token (env EVENTS_SYNC_TOKEN, header Authorization: Bearer ...).
 * Llamado por Cloud Scheduler. Variables de entorno:
 *   - EVENTS_SHEET_CSV_URL : URL del CSV publicado de la hoja.
 *   - EVENTS_SYNC_TOKEN    : token secreto compartido con Cloud Scheduler.
 *
 * Columnas esperadas (encabezado, en cualquier orden):
 *   titulo, disciplina, fecha_inicio, fecha_fin, departamento, ciudad,
 *   distancias, organizador, url_inscripcion, imagen_url, fuente, estado,
 *   destacado
 */

function parseCsv(text: string): Record<string, string>[] {
  const rows: string[][] = [];
  let field = "";
  let row: string[] = [];
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"' && text[i + 1] === '"') {
        field += '"';
        i++;
      } else if (c === '"') {
        inQuotes = false;
      } else {
        field += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (c !== "\r") {
      field += c;
    }
  }
  if (field.length || row.length) {
    row.push(field);
    rows.push(row);
  }
  if (rows.length === 0) return [];
  const header = rows[0].map((h) => h.trim().toLowerCase());
  return rows.slice(1).filter((r) => r.some((v) => v.trim())).map((r) => {
    const obj: Record<string, string> = {};
    header.forEach((h, idx) => (obj[h] = (r[idx] ?? "").trim()));
    return obj;
  });
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const token = process.env.EVENTS_SYNC_TOKEN;
  const url = process.env.EVENTS_SHEET_CSV_URL;
  const auth = req.headers.authorization ?? "";
  if (!token || auth !== `Bearer ${token}`) {
    return res.status(401).json({ error: "No autorizado." });
  }
  if (!url) {
    return res.status(400).json({ error: "EVENTS_SHEET_CSV_URL no configurada." });
  }

  const service: EventsModuleService = req.scope.resolve(EVENTS_MODULE);

  let csv: string;
  try {
    const r = await fetch(url);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    csv = await r.text();
  } catch (e) {
    return res.status(502).json({ error: `No se pudo leer la hoja: ${(e as Error).message}` });
  }

  const rows = parseCsv(csv);
  let creados = 0;
  let actualizados = 0;
  let omitidos = 0;

  for (const row of rows) {
    const titulo = row.titulo?.trim();
    const departamento = row.departamento?.trim();
    const fecha = new Date(row.fecha_inicio);
    if (
      !titulo ||
      !(DEPARTAMENTOS as readonly string[]).includes(departamento) ||
      Number.isNaN(fecha.getTime())
    ) {
      omitidos++;
      continue;
    }

    const disciplina = (DISCIPLINAS as readonly string[]).includes(row.disciplina)
      ? row.disciplina
      : "otro";
    const estado = (ESTADOS as readonly string[]).includes(row.estado)
      ? row.estado
      : "proximo";

    const data = {
      titulo,
      departamento,
      disciplina,
      estado,
      fecha_inicio: fecha,
      fecha_fin: row.fecha_fin ? new Date(row.fecha_fin) : null,
      ciudad: row.ciudad || null,
      distancias: row.distancias || null,
      organizador: row.organizador || null,
      url_inscripcion: row.url_inscripcion || null,
      imagen_url: row.imagen_url || null,
      fuente: row.fuente || "hoja_externa",
      destacado: /^(1|true|si|sí|x)$/i.test(row.destacado || ""),
      moderacion: "aprobado" as const,
    };

    // Idempotente: upsert por titulo + fecha_inicio.
    const existing = await service.listCaviEvents(
      { titulo, fecha_inicio: fecha },
      { take: 1 },
    );
    if (existing.length) {
      await service.updateCaviEvents({ id: existing[0].id, ...data });
      actualizados++;
    } else {
      await service.createCaviEvents([data]);
      creados++;
    }
  }

  res.json({ ok: true, creados, actualizados, omitidos, total: rows.length });
}
