import {
  AbstractPaymentProvider,
  MedusaError,
} from "@medusajs/framework/utils";
import {
  CreatePaymentProviderSession,
  PaymentProviderError,
  PaymentProviderSessionResponse,
  ProviderWebhookPayload,
  UpdatePaymentProviderSession,
  WebhookActionResult,
  Logger,
} from "@medusajs/framework/types";

type Options = {
  secretKey: string;
  publicKey?: string;
};

type InjectedDependencies = {
  logger: Logger;
};

const CULQI_API = "https://api.culqi.com/v2";

/**
 * Provider de pago Culqi para Medusa v2.
 *
 * La tokenización de la tarjeta ocurre en el storefront (Culqi Checkout) y el
 * `token id` llega en `data.token_id` al autorizar. Aquí creamos, capturamos y
 * reembolsamos el cargo contra la API de Culqi.
 */
class CulqiProviderService extends AbstractPaymentProvider<Options> {
  static identifier = "culqi";

  protected readonly options_: Options;
  protected readonly logger_: Logger;

  constructor({ logger }: InjectedDependencies, options: Options) {
    super(arguments[0], options);
    this.options_ = options;
    this.logger_ = logger;
  }

  static validateOptions(options: Record<string, unknown>) {
    if (!options.secretKey) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Culqi: falta 'secretKey' en la configuración del provider.",
      );
    }
  }

  private async culqi(path: string, body: Record<string, unknown>) {
    const res = await fetch(`${CULQI_API}${path}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.options_.secretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) {
      const msg =
        data?.user_message || data?.merchant_message || "Error en Culqi";
      throw new MedusaError(MedusaError.Types.UNEXPECTED_STATE, msg);
    }
    return data;
  }

  /** Inicia la sesión de pago: aún no hay cargo, solo se registra el monto. */
  async initiatePayment(
    input: CreatePaymentProviderSession,
  ): Promise<PaymentProviderError | PaymentProviderSessionResponse> {
    const { amount, currency_code } = input;
    return {
      data: {
        amount,
        currency_code,
        status: "pending",
      },
    };
  }

  /**
   * Autoriza el pago creando el cargo en Culqi con el token de la tarjeta que el
   * storefront guardó en la sesión (`data.token_id` y `data.email`).
   */
  async authorizePayment(
    input: Record<string, unknown>,
  ): Promise<
    | PaymentProviderError
    | { status: string; data: Record<string, unknown> }
  > {
    const data = (input.data ?? input) as Record<string, unknown>;
    const tokenId = data.token_id as string | undefined;
    const email = data.email as string | undefined;
    const amount = Number(data.amount);
    const currency = String(data.currency_code || "PEN").toUpperCase();

    if (!tokenId || !email) {
      return {
        error: "Faltan datos de la tarjeta (token_id/email).",
        code: "invalid_data",
        detail: "Culqi requiere token_id y email para el cargo.",
      };
    }

    try {
      const charge = await this.culqi("/charges", {
        amount: Math.round(amount * 100),
        currency_code: currency,
        email,
        source_id: tokenId,
        description: "Pedido CAVI STORE",
      });
      return {
        status: "authorized",
        data: { ...data, charge_id: charge.id, status: "authorized" },
      };
    } catch (e) {
      this.logger_.error(`[culqi] authorize error: ${(e as Error).message}`);
      return {
        error: (e as Error).message,
        code: "authorization_failed",
        detail: (e as Error).message,
      };
    }
  }

  /** En Culqi el cargo se captura al crearse; devolvemos el estado tal cual. */
  async capturePayment(
    input: Record<string, unknown>,
  ): Promise<PaymentProviderError | Record<string, unknown>> {
    const data = (input.data ?? input) as Record<string, unknown>;
    return { ...data, status: "captured" };
  }

  async refundPayment(
    input: Record<string, unknown>,
    refundAmount?: number,
  ): Promise<PaymentProviderError | Record<string, unknown>> {
    const data = (input.data ?? input) as Record<string, unknown>;
    const chargeId = data.charge_id as string | undefined;
    if (!chargeId) {
      return { error: "No hay charge_id para reembolsar", code: "invalid_data" };
    }
    try {
      const amount = refundAmount ?? Number(data.amount);
      const refund = await this.culqi("/refunds", {
        amount: Math.round(amount * 100),
        charge_id: chargeId,
        reason: "solicitud_comprador",
      });
      return { ...data, refund_id: refund.id, status: "refunded" };
    } catch (e) {
      return { error: (e as Error).message, code: "refund_failed" };
    }
  }

  async cancelPayment(
    input: Record<string, unknown>,
  ): Promise<PaymentProviderError | Record<string, unknown>> {
    const data = (input.data ?? input) as Record<string, unknown>;
    return { ...data, status: "canceled" };
  }

  async deletePayment(
    input: Record<string, unknown>,
  ): Promise<PaymentProviderError | Record<string, unknown>> {
    const data = (input.data ?? input) as Record<string, unknown>;
    return data;
  }

  async retrievePayment(
    input: Record<string, unknown>,
  ): Promise<PaymentProviderError | Record<string, unknown>> {
    const data = (input.data ?? input) as Record<string, unknown>;
    return data;
  }

  async updatePayment(
    input: UpdatePaymentProviderSession,
  ): Promise<PaymentProviderError | PaymentProviderSessionResponse> {
    return { data: { ...input.data, amount: input.amount } };
  }

  async getPaymentStatus(
    input: Record<string, unknown>,
  ): Promise<string> {
    const data = (input.data ?? input) as Record<string, unknown>;
    return (data.status as string) || "pending";
  }

  async getWebhookActionAndData(
    _payload: ProviderWebhookPayload["payload"],
  ): Promise<WebhookActionResult> {
    // Los webhooks de Culqi se cablean en una iteración posterior.
    return { action: "not_supported" as const };
  }
}

export default CulqiProviderService;
