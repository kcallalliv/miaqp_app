# CAVI STORE — E-commerce de performance deportivo

Tienda especializada en **running y natación** (y endurance en general) a nivel
nacional. Estética dark premium, verde eléctrico `#B8FF32` como color de marca.

Stack: **Next.js 15** (App Router) · **React 19** · **Tailwind CSS v4** ·
**TypeScript**.

## Roadmap por etapas

- **Etapa 1 — Fundación del storefront ✅:** design system CAVI, home premium
  (hero, categorías, catálogo, filtros), carrito persistente con salida a
  checkout + WhatsApp.
- **Etapa 2 — Backend Medusa.js ✅:** backend Medusa v2 en `backend/` (config +
  seed del catálogo CAVI) y capa de integración del storefront con la Store API
  (`lib/medusa`, `lib/catalog.ts`). Si Medusa no está configurado, el storefront
  cae automáticamente al catálogo mock (demo).
- **Etapa 3 — Pagos + WhatsApp:** pasarela (Culqi/Izipay/Mercado Pago) y canal
  de venta asistida por WhatsApp.
- **Etapa 4 — Infraestructura GCP:** Cloud Run, Cloud SQL, Redis, CI/CD.
- **Etapa 5 — Data Warehouse:** Datastream → BigQuery, dbt, dashboards en
  Looker Studio.

## Estructura

```
backend/             Backend Medusa v2 (Store API, seed del catálogo) — ver backend/README.md
app/                 Rutas y layout (App Router)
  layout.tsx         Fuentes, providers globales, header/footer/carrito
  page.tsx           Home
  globals.css        Design system CAVI (tokens de color, tipografía, utilidades)
components/
  site/              Header, Hero, MetricsTicker, CategoryGrid, ValueProps, Footer
  shop/              Shop (filtros), ProductCard, ProductVisual
  cart/              CartProvider (Context + localStorage), CartDrawer
  ui/                Iconos, Logo, Rating
lib/
  types.ts           Modelo de dominio (Product, CartLine, Sport…)
  categories.ts      Categorías/deportes
  products.ts        Catálogo mock (fallback cuando Medusa no está configurado)
  catalog.ts         Puerta única de datos: Medusa con fallback a mock
  medusa/            Cliente Store API, tipos y mappers Medusa → DTO de UI
  format.ts          Formato de moneda (PEN) y descuentos
  utils.ts           Helpers (cn, cartKey)
```

## Conectar el storefront a Medusa

1. Levanta el backend siguiendo `backend/README.md` y corre `npm run seed:cavi`.
2. Copia `.env.example` a `.env.local` y completa `MEDUSA_BACKEND_URL`,
   `MEDUSA_PUBLISHABLE_KEY` y `MEDUSA_REGION_ID` con lo que imprime el seed.
3. Reinicia el storefront: ahora sirve el catálogo real (ISR cada 60 s).

## Desarrollo local

```bash
npm install
npm run dev            # http://localhost:3000
npm run build && npm start   # producción en :8080
```

## Cloud Run (heredado, se afinará en Etapa 4)

El `Dockerfile` genera un build standalone y expone el puerto 8080.

```bash
gcloud run deploy cavi-store --source . --region us-central1 --allow-unauthenticated
```

## Notas técnicas

- El carrito se persiste en `localStorage` (`cavi.cart.v1`).
- Los visuales de producto son placeholders generados por CSS hasta integrar la
  fotografía real del catálogo.
- El número de WhatsApp (`components/cart/CartDrawer.tsx`) y el checkout con
  pasarela se configurarán por variables de entorno en la Etapa 3.
