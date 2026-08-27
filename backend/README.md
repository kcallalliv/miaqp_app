# CAVI STORE — Backend (Medusa v2)

Motor de commerce headless: productos, variantes, inventario, carrito, órdenes,
descuentos y (Etapa 3) pagos. Expone la **Store API** que consume el storefront
Next.js de la raíz del repo.

## Requisitos

- Node ≥ 20
- **PostgreSQL** (obligatorio)
- Redis (opcional en desarrollo; recomendado en producción)

## Puesta en marcha

```bash
cd backend
cp .env.template .env          # ajusta DATABASE_URL, CORS y secretos
npm install

# Base de datos: crea el esquema y corre migraciones
npm run db:setup               # = medusa db:create && medusa db:migrate

# Usuario admin (para el panel en http://localhost:9000/app)
npx medusa user -e admin@cavi.pe -p supersecret

# Catálogo CAVI: región PEN, canal, stock, publishable key, categorías y productos
npm run seed:cavi

# Levantar el servidor (API + admin)
npm run dev                    # http://localhost:9000
```

Al terminar, `npm run seed:cavi` imprime en consola los valores que debes copiar
al `.env.local` del **storefront** (carpeta raíz):

```
MEDUSA_BACKEND_URL=http://localhost:9000
MEDUSA_PUBLISHABLE_KEY=pk_...
MEDUSA_REGION_ID=reg_...
```

Con esas variables, el storefront deja de usar el catálogo mock y sirve los
productos reales de Medusa (con ISR cada 60 s).

## Notas

- El seed es **idempotente por nombre/handle**: puedes re-ejecutarlo sin duplicar
  región, canal, categorías ni productos.
- Las variantes se crean con `manage_inventory: false` para la Etapa 2 (catálogo).
  El stock mostrado viene de `metadata.stock`. Cuando se active la gestión de
  inventario real, el storefront usa automáticamente el stock del almacén.
- Moneda **PEN**; los precios están en unidades mayores (soles), como espera
  Medusa v2.
## Pagos con Culqi

El provider de pago **Culqi** está en `src/modules/culqi` y se registra en
`medusa-config.ts` dentro del módulo de pagos. Se activa automáticamente cuando
`CULQI_SECRET_KEY` está presente en `.env`:

```
CULQI_SECRET_KEY=sk_test_xxx
CULQI_PUBLIC_KEY=pk_test_xxx
```

El storefront tokeniza la tarjeta con Culqi Checkout y el token llega al provider
en la autorización (`authorizePayment`), que crea el cargo en Culqi. También
implementa captura y reembolsos. Los webhooks se cablearán en una iteración
posterior.

## Estructura

```
backend/
  medusa-config.ts        Config del servidor (DB, CORS, admin, pagos)
  src/
    modules/culqi/        Provider de pago Culqi (service + index)
    scripts/seed-cavi.ts  Seed autocontenido del catálogo CAVI
```
