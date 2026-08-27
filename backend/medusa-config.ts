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
});
