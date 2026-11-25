import { Module } from "@medusajs/framework/utils";
import EncargosModuleService from "./service";

export const ENCARGOS_MODULE = "encargos";

export default Module(ENCARGOS_MODULE, {
  service: EncargosModuleService,
});
