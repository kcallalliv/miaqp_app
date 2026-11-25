import { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { ENCARGOS_MODULE } from "../modules/encargos";
import type EncargosModuleService from "../modules/encargos/service";

/**
 * Seed de ejemplos de "Encargos USA" (idempotente por título).
 * Ejecutar: npm run seed:encargos
 */
function daysFromNow(d: number): Date {
  const x = new Date();
  x.setDate(x.getDate() + d);
  return x;
}

const SAMPLES = [
  {
    titulo: "Nike Vaporfly 3",
    categoria: "zapatillas",
    marca: "Nike",
    descripcion: "Zapatilla de competición con placa de carbono. Talla a coordinar.",
    precio_usa: 260,
    precio_peru_aprox: 1099,
    comision: 180,
    precio_final: 980,
    cupos_total: 3,
    destacado: true,
  },
  {
    titulo: "Garmin Forerunner 265",
    categoria: "tecnologia",
    marca: "Garmin",
    descripcion: "Reloj GPS AMOLED para running y multideporte.",
    precio_usa: 449,
    precio_peru_aprox: 2290,
    comision: 250,
    precio_final: 1990,
    cupos_total: 2,
    destacado: true,
  },
  {
    titulo: "Trisuit HUUB (competición)",
    categoria: "triatlon",
    marca: "HUUB",
    descripcion: "Traje de triatlón aero. Indicar talla y color.",
    precio_usa: 200,
    precio_peru_aprox: 950,
    comision: 150,
    precio_final: 820,
    cupos_total: 4,
    destacado: false,
  },
  {
    titulo: "Antiparras Roka R1",
    categoria: "natacion",
    marca: "Roka",
    descripcion: "Antiparras de aguas abiertas, visión panorámica.",
    precio_usa: 55,
    precio_peru_aprox: 320,
    comision: 60,
    precio_final: 280,
    cupos_total: 6,
    destacado: false,
  },
];

export default async function seedEncargos({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const service: EncargosModuleService = container.resolve(ENCARGOS_MODULE);

  const [existing] = await service.listAndCountCaviEncargoItems({}, { take: 500 });
  const titles = new Set((existing as Array<{ titulo: string }>).map((e) => e.titulo));

  const toCreate = SAMPLES.filter((s) => !titles.has(s.titulo)).map((s) => ({
    ...s,
    cupos_reservados: 0,
    activo: true,
    fecha_limite: daysFromNow(30),
  }));

  if (toCreate.length) {
    await service.createCaviEncargoItems(toCreate);
    logger.info(`✅ ${toCreate.length} encargos de ejemplo creados`);
  } else {
    logger.info("ℹ️  Los encargos de ejemplo ya existían");
  }
  logger.info("🏁 Seed de encargos completado.");
}
