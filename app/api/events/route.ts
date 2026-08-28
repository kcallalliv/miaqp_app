import { NextResponse } from "next/server";

/**
 * Ingesta de eventos de analítica → BigQuery (streaming insert).
 *
 * En Cloud Run obtiene el token del metadata server (sin claves). Si no hay
 * BigQuery configurado (`GCP_PROJECT_ID` + dataset/tabla), corre en modo demo:
 * registra el evento y responde OK.
 */

const PROJECT = process.env.GCP_PROJECT_ID;
const DATASET = process.env.BQ_EVENTS_DATASET || "raw";
const TABLE = process.env.BQ_EVENTS_TABLE || "raw_events";

interface Incoming {
  event?: string;
  sessionId?: string;
  path?: string;
  occurredAt?: string;
  productId?: string;
  /** Categoría/comunidad; se guarda en la columna `sport` de BigQuery. */
  community?: string;
  sport?: string;
  brand?: string;
  value?: number;
  currency?: string;
  quantity?: number;
  [key: string]: unknown;
}

async function getAccessToken(): Promise<string | null> {
  try {
    const res = await fetch(
      "http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token",
      { headers: { "Metadata-Flavor": "Google" } },
    );
    if (!res.ok) return null;
    const data = (await res.json()) as { access_token?: string };
    return data.access_token ?? null;
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  let e: Incoming;
  try {
    e = await req.json();
  } catch {
    return new NextResponse(null, { status: 204 });
  }
  if (!e.event) return new NextResponse(null, { status: 204 });

  const known = new Set([
    "event",
    "sessionId",
    "path",
    "occurredAt",
    "productId",
    "community",
    "sport",
    "brand",
    "value",
    "currency",
    "quantity",
  ]);
  const properties: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(e)) {
    if (!known.has(k)) properties[k] = v;
  }

  const row = {
    event_id:
      (globalThis.crypto?.randomUUID?.() as string) || `${Date.now()}-${Math.random()}`,
    event_name: String(e.event),
    occurred_at: e.occurredAt || new Date().toISOString(),
    session_id: e.sessionId ?? null,
    path: e.path ?? null,
    product_id: e.productId ?? null,
    // La columna `sport` guarda la comunidad/categoría (compatibilidad de esquema).
    sport: e.community ?? e.sport ?? null,
    brand: e.brand ?? null,
    value: typeof e.value === "number" ? e.value : null,
    currency: e.currency ?? "PEN",
    quantity: typeof e.quantity === "number" ? e.quantity : null,
    properties: Object.keys(properties).length ? JSON.stringify(properties) : null,
    user_agent: req.headers.get("user-agent"),
  };

  // --- Modo demo ---
  if (!PROJECT) {
    console.log("[events:demo]", row.event_name, row.product_id ?? "");
    return new NextResponse(null, { status: 204 });
  }

  // --- Inserción real en BigQuery ---
  const token = await getAccessToken();
  if (!token) return new NextResponse(null, { status: 204 });

  try {
    await fetch(
      `https://bigquery.googleapis.com/bigquery/v2/projects/${PROJECT}/datasets/${DATASET}/tables/${TABLE}/insertAll`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rows: [{ insertId: row.event_id, json: row }],
        }),
      },
    );
  } catch {
    // no bloqueamos la experiencia por un fallo de analítica
  }
  return new NextResponse(null, { status: 204 });
}
