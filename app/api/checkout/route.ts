import { NextResponse } from "next/server";

/**
 * Crea un cargo en Culqi con el token generado por Culqi Checkout en el cliente.
 *
 * - Si `CULQI_SECRET_KEY` está configurada, llama a la API de cargos de Culqi.
 * - Si no, responde en modo demo (para desarrollar sin credenciales todavía).
 *
 * En la evolución completa (Medusa), este cargo se orquesta desde el flujo de
 * pago de la orden; aquí sirve como puente funcional inmediato.
 */

const CULQI_SECRET_KEY = process.env.CULQI_SECRET_KEY;
const CULQI_CHARGES_URL = "https://api.culqi.com/v2/charges";

interface CheckoutBody {
  tokenId?: string;
  amount?: number; // en soles
  email?: string;
  customer?: { name?: string; phone?: string; address?: string; city?: string };
  items?: { name: string; qty: number; price: number }[];
}

export async function POST(req: Request) {
  let body: CheckoutBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const { tokenId, amount, email } = body;

  if (typeof amount !== "number" || amount <= 0) {
    return NextResponse.json({ error: "Monto inválido" }, { status: 400 });
  }
  if (!email) {
    return NextResponse.json({ error: "Falta el email" }, { status: 400 });
  }

  const amountCents = Math.round(amount * 100);

  // --- Modo demo: sin credenciales de Culqi todavía ---
  if (!CULQI_SECRET_KEY) {
    return NextResponse.json({
      demo: true,
      status: "paid",
      chargeId: `demo_${Date.now()}`,
      message:
        "Pago simulado (modo demo). Configura CULQI_SECRET_KEY para cobrar de verdad.",
    });
  }

  if (!tokenId) {
    return NextResponse.json(
      { error: "Falta el token de la tarjeta" },
      { status: 400 },
    );
  }

  // --- Cargo real en Culqi ---
  try {
    const res = await fetch(CULQI_CHARGES_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${CULQI_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: amountCents,
        currency_code: "PEN",
        email,
        source_id: tokenId,
        description: "Pedido CAVI STORE",
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      const msg =
        data?.user_message || data?.merchant_message || "Pago rechazado";
      return NextResponse.json({ error: msg }, { status: 402 });
    }

    return NextResponse.json({
      demo: false,
      status: "paid",
      chargeId: data.id,
    });
  } catch {
    return NextResponse.json(
      { error: "No se pudo procesar el pago. Intenta nuevamente." },
      { status: 502 },
    );
  }
}
