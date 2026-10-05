import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework";
import { Modules } from "@medusajs/framework/utils";
import { orderPlacedEmail } from "../lib/email-templates";

/** Envía el correo de confirmación cuando se crea un pedido. */
export default async function orderPlacedHandler({
  event,
  container,
}: SubscriberArgs<{ id: string }>) {
  const logger = container.resolve("logger");
  try {
    const notificationService = container.resolve(Modules.NOTIFICATION);
    const orderService = container.resolve(Modules.ORDER);

    const order = await orderService.retrieveOrder(event.data.id, {
      select: ["id", "display_id", "email", "currency_code", "total"],
      relations: ["items"],
    });
    if (!order?.email) return;

    const { subject, html } = orderPlacedEmail(order);
    await notificationService.createNotifications({
      to: order.email,
      channel: "email",
      template: "order-placed",
      content: { subject, html },
    });
  } catch (e) {
    // La analítica/correo nunca debe romper el flujo de compra.
    logger.error(
      `[email] order.placed: ${e instanceof Error ? e.message : String(e)}`,
    );
  }
}

export const config: SubscriberConfig = { event: "order.placed" };
