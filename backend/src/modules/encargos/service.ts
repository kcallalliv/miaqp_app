import { MedusaService } from "@medusajs/framework/utils";
import { CaviEncargoItem } from "./models/encargo";

/**
 * Servicio del módulo Encargos. MedusaService autogenera CRUD:
 *   listCaviEncargoItems, listAndCountCaviEncargoItems, retrieveCaviEncargoItem,
 *   createCaviEncargoItems, updateCaviEncargoItems, deleteCaviEncargoItems
 */
class EncargosModuleService extends MedusaService({ CaviEncargoItem }) {}

export default EncargosModuleService;
