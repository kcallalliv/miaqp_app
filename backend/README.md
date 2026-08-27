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
- Los módulos de **pago** (Culqi/Izipay/Mercado Pago) se integran en la Etapa 3.

## Estructura

```
backend/
  medusa-config.ts        Config del servidor (DB, CORS, admin)
  src/scripts/
    seed-cavi.ts          Seed autocontenido del catálogo CAVI
```
