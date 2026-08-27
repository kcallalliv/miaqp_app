# CAVI STORE — Data Warehouse (BigQuery)

Analítica del e-commerce sobre **BigQuery**, en `southamerica-west1`.

```
Cloud SQL (Medusa)  ──Datastream CDC──┐
                                      ▼
Storefront /api/events ──insertAll──► BigQuery  raw
                                      │  (dbt)
                                      ▼
                                   staging  → marts ──► Looker Studio
```

## Capas

- **raw** — datos crudos: réplica CDC de las tablas de Medusa (Datastream) +
  `raw_events` (eventos web insertados por el storefront).
- **staging** (dbt, vistas) — limpieza y tipado: `stg_orders`, `stg_order_items`,
  `stg_customers`, `stg_products`, `stg_events`.
- **marts** (dbt, tablas) — modelo dimensional y KPIs:
  - `dim_product`, `dim_customer`, `dim_date`
  - `fct_orders`, `fct_order_items`
  - `mart_sales_by_sport` — ventas por deporte y fecha (KPI central)
  - `mart_funnel` — conversión por sesión (add_to_cart → checkout → compra)
  - `mart_cart_abandonment` — carritos abandonados por deporte/marca/producto

## 1. Ingesta de eventos web (ya integrada)

El storefront envía eventos a `/api/events`, que los inserta en
`raw.raw_events` usando el token del metadata server de Cloud Run (sin claves).
La tabla y los permisos los crea Terraform (`deploy/terraform/warehouse.tf`).
En local, sin `GCP_PROJECT_ID`, corre en modo demo (solo log).

Eventos capturados hoy: `add_to_cart`, `begin_checkout`, `purchase`
(ampliables en `lib/analytics.ts`).

## 2. Ingesta CDC de Medusa (Datastream)

`enable_datastream=true` en Terraform crea el stream. Requisitos previos en
Cloud SQL:

1. Flags de instancia: `cloudsql.logical_decoding=on` (y `max_replication_slots`,
   `max_wal_senders` suficientes).
2. En la BD: `CREATE PUBLICATION cavi_pub FOR ALL TABLES;` y
   `SELECT pg_create_logical_replication_slot('cavi_slot', 'pgoutput');`
3. Conectividad Datastream ↔ Cloud SQL: IP privada (recomendado) o allowlist de
   los rangos de IP de Datastream para la región.

Datastream replica las tablas de Medusa al dataset `raw` con columnas
`_metadata_*` (usadas por los modelos de staging para filtrar borrados).

## 3. Transformaciones (dbt)

```bash
cd warehouse/dbt
cp profiles.yml.example ~/.dbt/profiles.yml   # completa project_id
dbt deps
dbt build            # corre modelos + tests
```

Programación: crea un **Cloud Scheduler** que dispare un job (Cloud Run Job o
Cloud Build) con `dbt build`, o usa dbt Cloud.

## 4. Dashboards (Looker Studio)

Conecta Looker Studio a BigQuery (dataset `marts`) y arma:

- **Ventas** — ingresos y unidades por deporte (`mart_sales_by_sport`),
  ticket promedio, tendencia diaria/mensual (join con `dim_date`).
- **Conversión** — embudo `mart_funnel` (add-to-cart, checkout, compra) y tasa
  de conversión en el tiempo.
- **Retención** — clientes nuevos vs. recurrentes (`dim_customer.is_returning`),
  LTV.
- **Oportunidades** — `mart_cart_abandonment` (productos/deportes más
  abandonados) para remarketing y ajustes de stock/precio.

Looker Studio no se versiona como código; documenta aquí el enlace del reporte
cuando lo crees.

## Notas

- Los nombres/columnas de las tablas replicadas siguen el esquema de Medusa v2;
  si tu Datastream aplica prefijos o cambia columnas, ajusta `models/staging`.
- Región de BigQuery = `southamerica-west1`; mantén los datasets y jobs en la
  misma región para evitar errores de ubicación.
