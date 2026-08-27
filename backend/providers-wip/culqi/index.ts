import { ModuleProvider, Modules } from "@medusajs/framework/utils";
import CulqiProviderService from "./service";

/**
 * Registro del provider de pago Culqi como módulo de pago de Medusa v2.
 * Se referencia desde `medusa-config.ts` en la lista de providers del módulo
 * de pagos.
 */
export default ModuleProvider(Modules.PAYMENT, {
  services: [CulqiProviderService],
});
