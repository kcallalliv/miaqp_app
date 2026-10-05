/**
 * Plantillas de email transaccional de CAVI STORE (HTML inline, email-safe).
 * Se mantienen en código para no depender de plantillas externas.
 */

const CARBON = "#0B0D0E";
const SURFACE = "#15191c";
const VOLT = "#B8FF32";
const INK = "#f7f7f5";
const MUTED = "#a7adb2";

const money = (v: unknown, currency = "PEN") => {
  const n = Number(v ?? 0);
  const code = currency.toUpperCase() === "PEN" ? "S/" : currency.toUpperCase();
  return `${code} ${n.toFixed(2)}`;
};

function shell(title: string, body: string): string {
  return `<!doctype html><html lang="es"><body style="margin:0;background:${CARBON};font-family:Arial,Helvetica,sans-serif;color:${INK}">
  <div style="max-width:560px;margin:0 auto;padding:24px">
    <div style="padding:20px 0;border-bottom:1px solid #343a3f">
      <span style="font-size:20px;font-weight:bold;color:${INK};letter-spacing:1px">CAVI<span style="color:${VOLT}">STORE</span></span>
    </div>
    <div style="padding:28px 0">
      <h1 style="font-size:20px;margin:0 0 12px;color:${INK}">${title}</h1>
      ${body}
    </div>
    <div style="padding:18px 0;border-top:1px solid #343a3f;color:${MUTED};font-size:12px">
      CAVI STORE · Equípate para ir más lejos · Perú<br/>
      Este correo es informativo; si no reconoces esta acción, ignóralo.
    </div>
  </div></body></html>`;
}

const btn = (href: string, label: string) =>
  `<a href="${href}" style="display:inline-block;background:${VOLT};color:${CARBON};text-decoration:none;font-weight:bold;padding:12px 20px;border-radius:10px">${label}</a>`;

interface OrderLike {
  display_id?: number | string;
  email?: string;
  currency_code?: string;
  total?: unknown;
  items?: Array<{ title?: string; quantity?: number; unit_price?: unknown }>;
}

export function orderPlacedEmail(order: OrderLike): { subject: string; html: string } {
  const cur = order.currency_code || "PEN";
  const rows = (order.items ?? [])
    .map(
      (i) =>
        `<tr>
          <td style="padding:8px 0;color:${INK};font-size:14px">${i.quantity ?? 1}× ${i.title ?? "Producto"}</td>
          <td style="padding:8px 0;color:${MUTED};font-size:14px;text-align:right">${money(i.unit_price, cur)}</td>
        </tr>`,
    )
    .join("");
  const body = `
    <p style="color:${MUTED};font-size:14px;line-height:1.6">¡Gracias por tu compra! Recibimos tu pedido <strong style="color:${INK}">#${order.display_id ?? ""}</strong> y lo estamos preparando. Te avisaremos cuando salga.</p>
    <div style="background:${SURFACE};border:1px solid #343a3f;border-radius:12px;padding:16px;margin:18px 0">
      <table style="width:100%;border-collapse:collapse">${rows}
        <tr><td style="padding-top:12px;border-top:1px solid #343a3f;color:${INK};font-weight:bold">Total</td>
        <td style="padding-top:12px;border-top:1px solid #343a3f;color:${VOLT};font-weight:bold;text-align:right">${money(order.total, cur)}</td></tr>
      </table>
    </div>
    <p style="color:${MUTED};font-size:13px">¿Dudas con tu pedido? Responde este correo o escríbenos por WhatsApp.</p>`;
  return { subject: `Pedido confirmado #${order.display_id ?? ""} · CAVI STORE`, html: shell("Confirmamos tu pedido", body) };
}

export function welcomeEmail(name?: string): { subject: string; html: string } {
  const body = `
    <p style="color:${MUTED};font-size:14px;line-height:1.6">Hola${name ? ` ${name}` : ""}, bienvenido a la comunidad CAVI. Equipamiento y nutrición para entrenar con objetivos: trail, ruta, triatlón, aguas abiertas y ciclismo.</p>
    <p style="color:${MUTED};font-size:14px;line-height:1.6">Cuando quieras asesoría para elegir tu equipo o tu plan de nutrición, escríbenos: te ayudamos a decidir.</p>
    <p style="margin:22px 0">${btn("https://cavistore.pe", "Ver la tienda")}</p>`;
  return { subject: "Bienvenido a CAVI STORE 🟢", html: shell("Bienvenido a CAVI", body) };
}

export function reclamoAckEmail(correlativo: string, nombre?: string): { subject: string; html: string } {
  const body = `
    <p style="color:${MUTED};font-size:14px;line-height:1.6">Hola${nombre ? ` ${nombre}` : ""}, registramos tu hoja del Libro de Reclamaciones.</p>
    <div style="background:${SURFACE};border:1px solid #343a3f;border-radius:12px;padding:16px;margin:18px 0">
      <span style="color:${MUTED};font-size:13px">Código de seguimiento</span><br/>
      <strong style="color:${VOLT};font-size:18px;letter-spacing:1px">${correlativo}</strong>
    </div>
    <p style="color:${MUTED};font-size:14px;line-height:1.6">Te responderemos dentro del plazo de ley (15 días hábiles). Conserva este código.</p>`;
  return { subject: `Reclamo registrado ${correlativo} · CAVI STORE`, html: shell("Recibimos tu reclamo", body) };
}
