#!/usr/bin/env bash
# =============================================================================
# CAVI STORE — Despliegue completo en un solo comando (Cloud Shell / gcloud)
#
#   bash deploy/deploy.sh
#
# Idempotente: puedes correrlo las veces que quieras. Hace:
#   1. Encender Cloud SQL y esperar a que esté RUNNABLE
#   2. Build del backend (Cloud Build) → migra la BD → despliega cavi-backend
#      (incluye el admin con Agenda + Inteligencia)
#   3. Seed del catálogo (18 productos, región PEN, publishable key)
#   4. Seed de la agenda de eventos
#   5. Crear/asegurar usuario admin
#   6. Build del storefront (Cloud Build) → despliega cavi-storefront
#   7. Cablear env del storefront (backend URL + publishable key + region)
#   8. Verificar y mostrar las URLs
#
# Todas las lecciones aprendidas van incrustadas: jobs con 2Gi de memoria,
# scripts compilados en .js, secreto DATABASE_URL, socket de Cloud SQL, etc.
# =============================================================================
set -euo pipefail

# --- Configuración (puedes sobreescribir por variable de entorno) -----------
PROJECT="${PROJECT:-cavi-store-1320}"
REGION="${REGION:-southamerica-west1}"
REPO="${REPO:-cavi}"
SA="${SA:-cavi-run@${PROJECT}.iam.gserviceaccount.com}"
CONN="${CONN:-${PROJECT}:${REGION}:cavi-pg}"
SQL_INSTANCE="${SQL_INSTANCE:-cavi-pg}"
ADMIN_EMAIL="${ADMIN_EMAIL:-admin@cavi.pe}"
ADMIN_PASS="${ADMIN_PASS:-CaviAdmin2026}"
CULQI_PUBLIC_KEY="${CULQI_PUBLIC_KEY:-}"   # pk_... si algún día lo tienes

# Valores de respaldo por si no se pueden leer del log del seed (el seed es
# idempotente: reutiliza región/key existentes por handle).
PUBLISHABLE_KEY_FALLBACK="${PUBLISHABLE_KEY_FALLBACK:-}"
REGION_ID_FALLBACK="${REGION_ID_FALLBACK:-reg_01M12GBJFTTCEVPQ66K94BWW9P}"

IMG_BACKEND="${REGION}-docker.pkg.dev/${PROJECT}/${REPO}/backend:latest"

# Ir a la raíz del repo (este script vive en deploy/).
cd "$(dirname "$0")/.."

log()  { printf '\n\033[1;32m▶ %s\033[0m\n' "$*"; }
warn() { printf '\033[1;33m⚠ %s\033[0m\n' "$*"; }

# --- 0. Proyecto correcto ----------------------------------------------------
log "0/8 · Proyecto GCP → ${PROJECT}"
gcloud config set project "${PROJECT}" >/dev/null
gcloud config set run/region "${REGION}" >/dev/null 2>&1 || true

# --- 1. Encender Cloud SQL y esperar RUNNABLE --------------------------------
log "1/8 · Encendiendo Cloud SQL (${SQL_INSTANCE})…"
gcloud sql instances patch "${SQL_INSTANCE}" --activation-policy=ALWAYS --quiet >/dev/null 2>&1 || true
printf "   Esperando estado RUNNABLE"
for _ in $(seq 1 60); do
  STATE="$(gcloud sql instances describe "${SQL_INSTANCE}" --format='value(state)' 2>/dev/null || echo '')"
  if [ "${STATE}" = "RUNNABLE" ]; then echo " ✓"; break; fi
  printf "."; sleep 10
done
[ "${STATE:-}" = "RUNNABLE" ] || { echo; warn "Cloud SQL no llegó a RUNNABLE; abortando."; exit 1; }

# --- 2. Build + migrate + deploy del backend (Cloud Build) -------------------
log "2/8 · Build del backend (build → migrate → deploy)…"
gcloud builds submit --config deploy/cloudbuild.backend.yaml \
  --substitutions="_REGION=${REGION}"

# --- helper: crear o actualizar un Cloud Run Job -----------------------------
job_upsert() {
  local name="$1"; shift
  if gcloud run jobs describe "${name}" --region="${REGION}" >/dev/null 2>&1; then
    gcloud run jobs update "${name}" "$@" --quiet
  else
    gcloud run jobs create "${name}" "$@" --quiet
  fi
}

# Args comunes a todos los jobs (memoria suficiente para bootear Medusa).
JOB_COMMON=(
  --image="${IMG_BACKEND}" --region="${REGION}" --service-account="${SA}"
  --set-cloudsql-instances="${CONN}"
  --memory=2Gi --cpu=2 --task-timeout=900
  --set-secrets=DATABASE_URL=database-url:latest
)

# --- 3. Seed del catálogo ----------------------------------------------------
log "3/8 · Seed del catálogo (18 productos + región + publishable key)…"
job_upsert cavi-seed "${JOB_COMMON[@]}" \
  --set-env-vars=PGSSLMODE=disable,MEDUSA_DISABLE_TELEMETRY=true,NODE_OPTIONS=--max-old-space-size=1536 \
  --command=npx --args=medusa,exec,./src/scripts/seed-cavi.js
gcloud run jobs execute cavi-seed --region="${REGION}" --wait

# Leer publishable key + region del log de la última ejecución del seed.
log "   Leyendo publishable key / region del seed…"
SEED_EXEC="$(gcloud run jobs executions list --job=cavi-seed --region="${REGION}" \
  --limit=1 --format='value(name)' 2>/dev/null || echo '')"
SEED_LOG=""
if [ -n "${SEED_EXEC}" ]; then
  SEED_LOG="$(gcloud logging read \
    "resource.type=cloud_run_job AND labels.\"run.googleapis.com/execution_name\"=${SEED_EXEC}" \
    --project="${PROJECT}" --limit=300 --freshness=1h \
    --format='value(textPayload)' 2>/dev/null || echo '')"
fi
PUBLISHABLE_KEY="$(printf '%s\n' "${SEED_LOG}" | grep -oE 'pk_[A-Za-z0-9]+' | head -1 || true)"
REGION_ID="$(printf '%s\n' "${SEED_LOG}" | grep -oE 'reg_[A-Za-z0-9]+' | head -1 || true)"
PUBLISHABLE_KEY="${PUBLISHABLE_KEY:-${PUBLISHABLE_KEY_FALLBACK}}"
REGION_ID="${REGION_ID:-${REGION_ID_FALLBACK}}"
echo "   PUBLISHABLE_KEY=${PUBLISHABLE_KEY:-(no encontrada)}"
echo "   REGION_ID=${REGION_ID:-(no encontrada)}"

# --- 4. Seed de la agenda de eventos -----------------------------------------
log "4/8 · Seed de la agenda de eventos…"
job_upsert cavi-seed-events "${JOB_COMMON[@]}" \
  --set-env-vars=PGSSLMODE=disable,MEDUSA_DISABLE_TELEMETRY=true,NODE_OPTIONS=--max-old-space-size=1536 \
  --command=npx --args=medusa,exec,./src/scripts/seed-events.js
gcloud run jobs execute cavi-seed-events --region="${REGION}" --wait

# --- 5. Usuario admin --------------------------------------------------------
log "5/8 · Asegurando usuario admin (${ADMIN_EMAIL})…"
job_upsert cavi-admin-user "${JOB_COMMON[@]}" \
  --set-env-vars=PGSSLMODE=disable,MEDUSA_DISABLE_TELEMETRY=true \
  --command=npx --args="medusa,user,-e,${ADMIN_EMAIL},-p,${ADMIN_PASS}"
# Si el usuario ya existe, el job devuelve error: no debe abortar el deploy.
gcloud run jobs execute cavi-admin-user --region="${REGION}" --wait \
  || warn "El usuario admin probablemente ya existía (ok)."

# --- 6. Build + deploy del storefront ----------------------------------------
log "6/8 · Build del storefront…"
gcloud builds submit --config deploy/cloudbuild.storefront.yaml \
  --substitutions="_REGION=${REGION},_CULQI_PUBLIC_KEY=${CULQI_PUBLIC_KEY}"

# --- 7. Cablear env del storefront -------------------------------------------
log "7/8 · Cableando env del storefront…"
BACKEND_URL="$(gcloud run services describe cavi-backend --region="${REGION}" \
  --format='value(status.url)')"
ENV_PAIRS="MEDUSA_BACKEND_URL=${BACKEND_URL}"
[ -n "${PUBLISHABLE_KEY}" ] && ENV_PAIRS="${ENV_PAIRS},MEDUSA_PUBLISHABLE_KEY=${PUBLISHABLE_KEY}"
[ -n "${REGION_ID}" ]       && ENV_PAIRS="${ENV_PAIRS},MEDUSA_REGION_ID=${REGION_ID}"
gcloud run services update cavi-storefront --region="${REGION}" \
  --update-env-vars="${ENV_PAIRS}" --quiet

# --- 8. Verificación ---------------------------------------------------------
log "8/8 · Verificación"
STORE_URL="$(gcloud run services describe cavi-storefront --region="${REGION}" \
  --format='value(status.url)')"
echo "   Backend   : ${BACKEND_URL}"
echo "   Admin     : ${BACKEND_URL}/app   (${ADMIN_EMAIL} / ${ADMIN_PASS})"
echo "   Storefront: ${STORE_URL}"
printf "   Probando API pública de eventos… "
if curl -fsS "${BACKEND_URL}/store/events?all=1" >/dev/null 2>&1; then echo "OK"; else echo "revisar"; fi

cat <<EOF

✅ Despliegue completo.
   • Tienda:      ${STORE_URL}
   • Admin:       ${BACKEND_URL}/app  →  pestañas "Agenda" e "Inteligencia"
   • Experimento: wa_advisory_v1 ya activo en la tienda (CTA de asesoría).

💡 Para dejar de pagar Cloud SQL mientras no pruebas:
     gcloud sql instances patch ${SQL_INSTANCE} --activation-policy=NEVER
   (Cloud Run escala a cero solo; no necesitas apagarlo.)
EOF
