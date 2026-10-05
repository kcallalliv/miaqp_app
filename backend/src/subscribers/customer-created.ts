import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework";
import { Modules } from "@medusajs/framework/utils";
import { welcomeEmail } from "../lib/email-templates";

/** Correo de bienvenida al registrarse un cliente. */
export default async function customerCreatedHandler({
  event,
  container,
}: SubscriberArgs<{ id: string }>) {
  const logger = container.resolve("logger");
  try {
    const notificationService = container.resolve(Modules.NOTIFICATION);
    const customerService = container.resolve(Modules.CUSTOMER);

    const customer = await customerService.retrieveCustomer(event.data.id, {
      select: ["id", "email", "first_name"],
    });
    if (!customer?.email) return;

    const { subject, html } = welcomeEmail(customer.first_name ?? undefined);
    await notificationService.createNotifications({
      to: customer.email,
      channel: "email",
      template: "welcome",
      content: { subject, html },
    });
  } catch (e) {
    logger.error(
      `[email] customer.created: ${e instanceof Error ? e.message : String(e)}`,
    );
  }
}

export const config: SubscriberConfig = { event: "customer.created" };
