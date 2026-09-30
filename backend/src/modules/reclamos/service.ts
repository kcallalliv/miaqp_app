import { MedusaService } from "@medusajs/framework/utils";
import { CaviReclamo } from "./models/reclamo";

/**
 * Servicio del módulo Reclamos. MedusaService autogenera CRUD:
 *   listCaviReclamos, listAndCountCaviReclamos, retrieveCaviReclamo,
 *   createCaviReclamos, updateCaviReclamos, deleteCaviReclamos
 */
class ReclamosModuleService extends MedusaService({ CaviReclamo }) {}

export default ReclamosModuleService;
