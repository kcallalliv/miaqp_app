import { loadEnv, defineConfig } from "@medusajs/framework/utils";

loadEnv(process.env.NODE_ENV || "development", process.cwd());

/**
 * Configuración del backend Medusa v2 para CAVI STORE.
 *
 * Usa los módulos por defecto de Medusa (incluye el módulo de pagos con el
 * provider de sistema/manual). El provider de pago Culqi está en
 * `providers-wip/culqi` y se integrará como módulo aquí cuando existan
 * credenciales de Culqi y se pueda probar contra un Medusa en ejecución.
 * Mientras tanto, el storefront cobra con Culqi por su propia ruta.
 */
export default defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    // El socket de Cloud SQL no soporta SSL; se desactiva explícitamente.
    // (El tipo de Medusa no admite `ssl: false`, pero pg sí; de ahí el cast.)
    // Para una BD que sí requiera SSL, exporta DATABASE_SSL=true.
    databaseDriverOptions: (process.env.DATABASE_SSL === "true"
      ? { connection: { ssl: { rejectUnauthorized: false } } }
      : { connection: { ssl: false } }) as Record<string, unknown>,
    redisUrl: process.env.REDIS_URL,
    http: {
      storeCors: process.env.STORE_CORS || "http://localhost:3000",
      adminCors: process.env.ADMIN_CORS || "http://localhost:9000",
      authCors: process.env.AUTH_CORS || "http://localhost:3000",
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    },
  },
  admin: {
    disable: process.env.DISABLE_MEDUSA_ADMIN === "true",
  },
  modules: [
    // Agenda de eventos de endurance (entidad custom Event).
    { resolve: "./src/modules/events" },
  ],
});
