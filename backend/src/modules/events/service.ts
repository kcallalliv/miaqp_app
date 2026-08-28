import { MedusaService } from "@medusajs/framework/utils";
import { CaviEvent } from "./models/event";

/**
 * Servicio del módulo Events. MedusaService autogenera CRUD:
 *   listCaviEvents, listAndCountCaviEvents, retrieveCaviEvent,
 *   createCaviEvents, updateCaviEvents, deleteCaviEvents
 */
class EventsModuleService extends MedusaService({ CaviEvent }) {}

export default EventsModuleService;
