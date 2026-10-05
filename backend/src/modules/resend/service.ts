import {
  AbstractNotificationProviderService,
  MedusaError,
} from "@medusajs/framework/utils";
import type {
  Logger,
  ProviderSendNotificationDTO,
  ProviderSendNotificationResultsDTO,
} from "@medusajs/framework/types";

type Options = {
  api_key?: string;
  from?: string;
  channels?: string[];
};

type InjectedDependencies = { logger: Logger };

/**
 * Proveedor de notificaciones por email vía Resend (API HTTP simple).
 * Las plantillas se arman en los subscribers y llegan como `content`
 * (subject + html). Si no hay RESEND_API_KEY, NO envía (solo loguea), para
 * que el backend arranque igual en dev / sin credenciales.
 */
class ResendNotificationProviderService extends AbstractNotificationProviderService {
  static identifier = "resend";
  protected logger_: Logger;
  protected options_: Options;

  constructor({ logger }: InjectedDependencies, options: Options) {
    super();
    this.logger_ = logger;
    this.options_ = options;
  }

  async send(
    notification: ProviderSendNotificationDTO,
  ): Promise<ProviderSendNotificationResultsDTO> {
    if (!notification?.to) {
      throw new MedusaError(MedusaError.Types.INVALID_DATA, "Falta destinatario");
    }
    const to = notification.to;
    const from =
      notification.from?.trim() ||
      this.options_.from ||
      "CAVI STORE <onboarding@resend.dev>";
    const subject = notification.content?.subject ?? "CAVI STORE";
    const html = notification.content?.html ?? notification.content?.text ?? "";

    if (!this.options_.api_key) {
      this.logger_.warn(
        `[resend] sin RESEND_API_KEY — email NO enviado a ${to} ("${subject}")`,
      );
      return {};
    }

    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.options_.api_key}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ from, to, subject, html }),
      });
      if (!res.ok) {
        const t = await res.text().catch(() => "");
        throw new Error(`${res.status} ${t}`);
      }
      const data = (await res.json().catch(() => ({}))) as { id?: string };
      this.logger_.info(`[resend] email enviado a ${to} ("${subject}")`);
      return { id: data?.id };
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      this.logger_.error(`[resend] fallo al enviar a ${to}: ${msg}`);
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        `Resend: ${msg}`,
      );
    }
  }
}

export default ResendNotificationProviderService;
