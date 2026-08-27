# CAVI STORE — Infraestructura y despliegue (GCP)

Región: **southamerica-west1** (Santiago) · Cómputo: **Cloud Run** · BD:
**Cloud SQL (PostgreSQL 16)** · Imágenes: **Artifact Registry** · Secretos:
**Secret Manager** · CI/CD: **Cloud Build** · Redis: **Memorystore** (opcional).

```
Internet
   │
   ├── cavi-storefront (Cloud Run :8080)  ── Next.js
   │        │ MEDUSA_BACKEND_URL
   │        ▼
   └── cavi-backend (Cloud Run :9000)     ── Medusa v2
            │  socket /cloudsql            │ (opcional) VPC ── Memorystore Redis
            ▼
        Cloud SQL (PostgreSQL 16)
```

## Requisitos previos

- `gcloud` y `terraform` (>= 1.5) instalados y autenticados (`gcloud auth login`,
  `gcloud auth application-default login`).
- Un proyecto de GCP creado en la organización, con **facturación activa**.

## 1. Provisionar la infraestructura (Terraform)

```bash
cd deploy/terraform
cp terraform.tfvars.example terraform.tfvars   # completa project_id y secretos
terraform init
terraform apply
```

Esto crea Artifact Registry, Cloud SQL, Secret Manager, service account, los dos
servicios Cloud Run (con **imagen placeholder** al inicio) y el job de
migraciones. Las claves de Culqi y las del seed de Medusa se dejan vacías y se
completan más adelante (ver paso 4).

> Idempotente: `terraform apply` no recrea lo que ya existe; el CI/CD gestiona la
> imagen de los servicios (Terraform ignora ese campo).

## 2. Construir y desplegar las imágenes (Cloud Build)

```bash
# Backend (construye, migra la BD y despliega)
gcloud builds submit --config deploy/cloudbuild.backend.yaml \
  --substitutions=_REGION=southamerica-west1

# Storefront (la pk de Culqi es pública y se hornea en build)
gcloud builds submit --config deploy/cloudbuild.storefront.yaml \
  --substitutions=_REGION=southamerica-west1,_WHATSAPP=51966538608,_CULQI_PUBLIC_KEY=
```

## 3. Sembrar el catálogo CAVI (una vez)

El seed crea región PEN, canal, categorías, productos y la **publishable key**.
La forma más simple es ejecutarlo contra Cloud SQL con el proxy:

```bash
# En una terminal: proxy a Cloud SQL
cloud-sql-proxy $(terraform -chdir=deploy/terraform output -raw cloudsql_connection_name)

# En otra: apunta DATABASE_URL al proxy y siembra
cd backend
DATABASE_URL="postgres://medusa:TU_PASS@127.0.0.1:5432/cavi_store" npm run seed:cavi
```

Anota de la salida `MEDUSA_PUBLISHABLE_KEY` y `MEDUSA_REGION_ID`.

## 4. Completar secretos y redeploy

```bash
# Claves del seed (storefront)
printf '%s' "pk_XXX"  | gcloud secrets versions add medusa-publishable-key --data-file=-
printf '%s' "reg_XXX" | gcloud secrets versions add medusa-region-id --data-file=-

# Cuando tengas Culqi
printf '%s' "sk_XXX" | gcloud secrets versions add culqi-secret-key --data-file=-
```

> Si un secreto no existía (estaba vacío en Terraform), créalo primero:
> `gcloud secrets create medusa-publishable-key --replication-policy=automatic`
> o añade el valor en `terraform.tfvars` y re-aplica.

Vuelve a desplegar para tomar los nuevos secretos:

```bash
gcloud run services update cavi-storefront --region southamerica-west1
```

## Dominio propio

```bash
gcloud beta run domain-mappings create --service cavi-storefront \
  --domain www.cavistore.pe --region southamerica-west1
```
Luego añade el registro CNAME/A que indique el comando en tu DNS.

## Rollback

```bash
gcloud run services update-traffic cavi-storefront \
  --region southamerica-west1 --to-revisions PREVIOUS_REVISION=100
```

## Costos aproximados (referenciales)

- Cloud Run: escala a 0 (pagas por uso). Muy bajo con tráfico inicial.
- Cloud SQL `db-custom-1-3840`: ~US$50–70/mes (encendido 24/7).
- Memorystore 1 GB (si `enable_redis=true`): ~US$35/mes.
- Artifact Registry / Secret Manager: centavos.

Para abaratar en etapa temprana: `db-f1-micro`/`db-g1-small` y `enable_redis=false`.

## Notas de seguridad

- `terraform.tfvars` y el estado (`*.tfstate`) contienen secretos → están en
  `.gitignore`. Usa un **backend GCS** para el estado en equipo (ver
  `versions.tf`).
- Considera restringir CORS del backend (`STORE_CORS`) al dominio real del
  storefront en producción (hoy `*` para simplificar el arranque).
