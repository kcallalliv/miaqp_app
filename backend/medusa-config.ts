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
/**
 * Módulo de archivos (imágenes de producto).
 * Si hay bucket configurado (S3_BUCKET), usa GCS/S3 para que las imágenes
 * PERSISTAN (Cloud Run es efímero). Si no, usa almacenamiento local (dev).
 * GCS se usa vía su API S3-compatible: endpoint + llaves HMAC.
 */
const fileModule = process.env.S3_BUCKET
  ? [
      {
        resolve: "@medusajs/file",
        options: {
          providers: [
            {
              resolve: "@medusajs/file-s3",
              id: "s3",
              options: {
                file_url: process.env.S3_FILE_URL,
                bucket: process.env.S3_BUCKET,
                endpoint: process.env.S3_ENDPOINT,
                region: process.env.S3_REGION || "auto",
                access_key_id: process.env.S3_ACCESS_KEY_ID,
                secret_access_key: process.env.S3_SECRET_ACCESS_KEY,
                // GCS requiere path-style para su API S3-compatible.
                additional_client_config: { forcePathStyle: true },
              },
            },
          ],
        },
      },
    ]
  : [];

/**
 * Notificaciones por email (Resend). El proveedor no envía si falta
 * RESEND_API_KEY (solo loguea), así el backend arranca igual sin credenciales.
 */
const notificationModule = {
  resolve: "@medusajs/notification",
  options: {
    providers: [
      {
        resolve: "./src/modules/resend",
        id: "resend",
        options: {
          channels: ["email"],
          api_key: process.env.RESEND_API_KEY,
          from: process.env.EMAIL_FROM || "CAVI STORE <onboarding@resend.dev>",
        },
      },
    ],
  },
};

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
    // Libro de Reclamaciones digital (Perú).
    { resolve: "./src/modules/reclamos" },
    // Almacenamiento de imágenes (GCS/S3 si está configurado; si no, local).
    ...fileModule,
    // Notificaciones por email (Resend).
    notificationModule,
  ],
});
