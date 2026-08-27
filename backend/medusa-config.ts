import { loadEnv, defineConfig } from "@medusajs/framework/utils";

loadEnv(process.env.NODE_ENV || "development", process.cwd());

/**
 * Configuración del backend Medusa v2 para CAVI STORE.
 * Incluye el provider de pago Culqi (Etapa 3).
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
  modules: [
    {
      resolve: "@medusajs/medusa/payment",
      options: {
        providers: [
          // Provider de pago local (efectivo/manual), útil en desarrollo.
          {
            resolve: "@medusajs/medusa/payment-system",
            id: "system",
          },
          // Provider Culqi (solo se activa si hay CULQI_SECRET_KEY).
          ...(process.env.CULQI_SECRET_KEY
            ? [
                {
                  resolve: "./src/modules/culqi",
                  id: "culqi",
                  options: {
                    secretKey: process.env.CULQI_SECRET_KEY,
                    publicKey: process.env.CULQI_PUBLIC_KEY,
                  },
                },
              ]
            : []),
        ],
      },
    },
  ],
});
