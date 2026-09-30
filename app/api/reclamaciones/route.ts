import { NextResponse } from "next/server";
import {
  MEDUSA_BACKEND_URL,
  MEDUSA_PUBLISHABLE_KEY,
  isMedusaEnabled,
} from "@/lib/medusa/client";

/**
 * Proxy del Libro de Reclamaciones → Medusa /store/reclamos (persistente).
 * En modo demo (sin Medusa) responde con un correlativo simulado.
 */
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  if (!isMedusaEnabled()) {
    return NextResponse.json({
      ok: true,
      demo: true,
      correlativo: `CAVI-DEMO-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
      message: "Recibido (demo). Con backend, quedaría registrado formalmente.",
    });
  }

  try {
    const res = await fetch(`${MEDUSA_BACKEND_URL}/store/reclamos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-publishable-api-key": MEDUSA_PUBLISHABLE_KEY as string,
      },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { error: "No se pudo registrar. Intenta más tarde." },
      { status: 502 },
    );
  }
}
