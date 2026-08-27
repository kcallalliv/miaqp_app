# CAVI STORE — E-commerce de performance deportivo

Tienda especializada en **running y natación** (y endurance en general) a nivel
nacional. Estética dark premium, verde eléctrico `#B8FF32` como color de marca.

Stack: **Next.js 15** (App Router) · **React 19** · **Tailwind CSS v4** ·
**TypeScript**.

## Roadmap por etapas

- **Etapa 1 — Fundación del storefront (actual):** design system CAVI, home
  premium (hero, categorías, catálogo, filtros), carrito persistente con salida
  a checkout + WhatsApp. Catálogo con **datos mock** (`lib/products.ts`).
- **Etapa 2 — Backend Medusa.js:** catálogo real, variantes, inventario y
  órdenes vía Store API.
- **Etapa 3 — Pagos + WhatsApp:** pasarela (Culqi/Izipay/Mercado Pago) y canal
  de venta asistida por WhatsApp.
- **Etapa 4 — Infraestructura GCP:** Cloud Run, Cloud SQL, Redis, CI/CD.
- **Etapa 5 — Data Warehouse:** Datastream → BigQuery, dbt, dashboards en
  Looker Studio.

## Estructura

```
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
  products.ts        Catálogo mock (se reemplaza por Medusa en Etapa 2)
  format.ts          Formato de moneda (PEN) y descuentos
  utils.ts           Helpers (cn, cartKey)
```

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
