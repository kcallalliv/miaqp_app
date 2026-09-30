import { Module } from "@medusajs/framework/utils";
import ReclamosModuleService from "./service";

export const RECLAMOS_MODULE = "reclamos";

export default Module(RECLAMOS_MODULE, {
  service: ReclamosModuleService,
});
