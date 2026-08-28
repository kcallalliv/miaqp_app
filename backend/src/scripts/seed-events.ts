import { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { EVENTS_MODULE } from "../modules/events";
import type EventsModuleService from "../modules/events/service";

/**
 * Seed inicial de la AGENDA (ejemplos curados para arrancar).
 * Fechas relativas para que siempre aparezcan como próximas. El equipo edita
 * datos reales (fecha exacta y url_inscripcion oficial) desde el admin.
 *
 * Ejecutar:  medusa exec ./src/scripts/seed-events.ts
 */
export default async function seedEvents({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const service: EventsModuleService = container.resolve(EVENTS_MODULE);

  const inDays = (d: number) => {
    const x = new Date();
    x.setHours(9, 0, 0, 0);
    x.setDate(x.getDate() + d);
    return x;
  };

  const AGENDA = [
    { titulo: "Misti Ultra Summit", disciplina: "trail", departamento: "Arequipa", ciudad: "Arequipa · Volcán Misti", distancias: "21K, 42K, 50K", organizador: "Comunidad trail Arequipa", estado: "inscripciones_abiertas", destacado: true, fecha_inicio: inDays(45) },
    { titulo: "Misti SkyRace", disciplina: "trail", departamento: "Arequipa", ciudad: "Arequipa · Altura", distancias: "Vertical, 28K", organizador: "SkyRunning Perú", estado: "proximo", destacado: true, fecha_inicio: inDays(80) },
    { titulo: "Triatlón de Arequipa", disciplina: "triatlon", departamento: "Arequipa", ciudad: "Arequipa", distancias: "Sprint, Olímpico", organizador: "Fed. de Triatlón", estado: "proximo", destacado: false, fecha_inicio: inDays(60) },
    { titulo: "Maratón de Lima 42K", disciplina: "ruta", departamento: "Lima", ciudad: "Lima", distancias: "10K, 21K, 42K", organizador: "Maratón Lima", estado: "inscripciones_abiertas", destacado: false, fecha_inicio: inDays(30) },
    { titulo: "Aguas Abiertas Titicaca", disciplina: "aguas_abiertas", departamento: "Puno", ciudad: "Puno · Lago Titicaca", distancias: "1.5K, 3K", organizador: "Open Water Perú", estado: "proximo", destacado: false, fecha_inicio: inDays(100) },
    { titulo: "Gran Fondo Colca", disciplina: "ciclismo", departamento: "Arequipa", ciudad: "Valle del Colca", distancias: "80K, 120K", organizador: "Ciclismo Colca", estado: "proximo", destacado: false, fecha_inicio: inDays(70) },
    { titulo: "Trail Cusco Sacred Valley", disciplina: "trail", departamento: "Cusco", ciudad: "Valle Sagrado", distancias: "12K, 30K", organizador: "Andes Trail", estado: "proximo", destacado: false, fecha_inicio: inDays(90) },
  ];

  let creados = 0;
  for (const ev of AGENDA) {
    const existing = await service.listCaviEvents(
      { titulo: ev.titulo, fecha_inicio: ev.fecha_inicio },
      { take: 1 },
    );
    if (existing.length) continue;
    await service.createCaviEvents([
      {
        ...ev,
        url_inscripcion: null, // el equipo carga la URL oficial en el admin
        fuente: "ejemplo_curado · editar en admin",
        moderacion: "aprobado",
      },
    ]);
    creados++;
  }

  logger.info(`🏁 Seed de agenda: ${creados} eventos de ejemplo creados.`);
  logger.info("Edita fechas reales y url_inscripcion oficial desde el admin/API.");
}
