# ==================================================================
# Data Warehouse — BigQuery (datasets, tabla de eventos, Datastream)
# ==================================================================

locals {
  bq_location = var.region # southamerica-west1
}

# --- Datasets: raw → staging → marts ---
resource "google_bigquery_dataset" "raw" {
  dataset_id  = "raw"
  location    = local.bq_location
  description = "Datos crudos: réplica CDC de Medusa + eventos web."
  depends_on  = [google_project_service.apis]
}

resource "google_bigquery_dataset" "staging" {
  dataset_id  = "staging"
  location    = local.bq_location
  description = "Modelos de staging (dbt)."
  depends_on  = [google_project_service.apis]
}

resource "google_bigquery_dataset" "marts" {
  dataset_id  = "marts"
  location    = local.bq_location
  description = "Marts de negocio (dbt): ventas, clientes, funnel."
  depends_on  = [google_project_service.apis]
}

# --- Tabla de eventos web (destino de /api/events) ---
resource "google_bigquery_table" "raw_events" {
  dataset_id          = google_bigquery_dataset.raw.dataset_id
  table_id            = "raw_events"
  deletion_protection = false

  time_partitioning {
    type  = "DAY"
    field = "occurred_at"
  }
  clustering = ["event_name", "sport"]

  schema = jsonencode([
    { name = "event_id", type = "STRING", mode = "REQUIRED" },
    { name = "event_name", type = "STRING", mode = "REQUIRED" },
    { name = "occurred_at", type = "TIMESTAMP", mode = "REQUIRED" },
    { name = "session_id", type = "STRING" },
    { name = "path", type = "STRING" },
    { name = "product_id", type = "STRING" },
    { name = "sport", type = "STRING" },
    { name = "brand", type = "STRING" },
    { name = "value", type = "NUMERIC" },
    { name = "currency", type = "STRING" },
    { name = "quantity", type = "INTEGER" },
    { name = "properties", type = "JSON" },
    { name = "user_agent", type = "STRING" },
  ])
}

# El runtime de Cloud Run inserta eventos → necesita dataEditor en `raw`.
resource "google_bigquery_dataset_iam_member" "run_events_writer" {
  dataset_id = google_bigquery_dataset.raw.dataset_id
  role       = "roles/bigquery.dataEditor"
  member     = "serviceAccount:${google_service_account.run.email}"
}

# --- Datastream: Cloud SQL (PostgreSQL) → BigQuery (opcional) ---
# Requisitos previos (ver warehouse/README.md):
#  - Flag de instancia `cloudsql.logical_decoding=on` y extensión pglogical.
#  - Usuario de replicación y publicación/replication slot.
#  - Conectividad Datastream ↔ Cloud SQL (IP privada o allowlist de IPs).
resource "google_datastream_connection_profile" "source" {
  count                 = var.enable_datastream ? 1 : 0
  display_name          = "cavi-cloudsql-source"
  location              = var.region
  connection_profile_id = "cavi-cloudsql-source"

  postgresql_profile {
    hostname = google_sql_database_instance.pg.public_ip_address
    port     = 5432
    username = local.db_user
    password = var.db_password
    database = local.db_name
  }
}

resource "google_datastream_connection_profile" "dest" {
  count                 = var.enable_datastream ? 1 : 0
  display_name          = "cavi-bq-dest"
  location              = var.region
  connection_profile_id = "cavi-bq-dest"

  bigquery_profile {}
}

resource "google_datastream_stream" "cdc" {
  count        = var.enable_datastream ? 1 : 0
  display_name = "cavi-cloudsql-to-bq"
  location     = var.region
  stream_id    = "cavi-cloudsql-to-bq"

  source_config {
    source_connection_profile = google_datastream_connection_profile.source[0].id
    postgresql_source_config {
      publication      = "cavi_pub"
      replication_slot = "cavi_slot"
    }
  }

  destination_config {
    destination_connection_profile = google_datastream_connection_profile.dest[0].id
    bigquery_destination_config {
      data_freshness = "900s"
      single_target_dataset {
        dataset_id = "${var.project_id}:${google_bigquery_dataset.raw.dataset_id}"
      }
    }
  }

  backfill_all {}
}
