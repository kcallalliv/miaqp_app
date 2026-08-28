import { NextResponse } from "next/server";
import {
  MEDUSA_BACKEND_URL,
  MEDUSA_PUBLISHABLE_KEY,
  isMedusaEnabled,
} from "@/lib/medusa/client";

/**
 * Proxy del formulario público "¿Organizas una carrera?".
 * Reenvía a Medusa /store/events/submit (crea el evento en moderación
 * "pendiente"). En modo demo (sin Medusa) responde OK sin persistir.
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
      message: "Recibido (demo). Con backend, quedaría pendiente de revisión.",
    });
  }

  try {
    const res = await fetch(`${MEDUSA_BACKEND_URL}/store/events/submit`, {
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
      { error: "No se pudo enviar. Intenta más tarde." },
      { status: 502 },
    );
  }
}
