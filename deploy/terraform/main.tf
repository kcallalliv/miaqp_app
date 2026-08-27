# ==================================================================
# CAVI STORE — Infraestructura GCP (Cloud Run + Cloud SQL + Secrets)
# ==================================================================

locals {
  services = [
    "run.googleapis.com",
    "sqladmin.googleapis.com",
    "artifactregistry.googleapis.com",
    "secretmanager.googleapis.com",
    "cloudbuild.googleapis.com",
    "compute.googleapis.com",
    "vpcaccess.googleapis.com",
    "redis.googleapis.com",
    "bigquery.googleapis.com",
    "datastream.googleapis.com",
  ]

  db_name   = "cavi_store"
  db_user   = "medusa"
  conn_name = google_sql_database_instance.pg.connection_name
  # Medusa (MikroORM) usa `host = decodeURIComponent(url.hostname)`, así que el
  # socket de Cloud SQL va codificado COMO host de la URL (no como ?host=).
  # Resultado: host=/cloudsql/<conn> y puerto 5432 → socket /cloudsql/<conn>/.s.PGSQL.5432
  database_url = "postgres://${local.db_user}:${var.db_password}@${urlencode("/cloudsql/${local.conn_name}")}:5432/${local.db_name}"

  # Secretos a crear con sus valores. Solo se incluyen los que tienen valor,
  # para que `terraform apply` funcione desde el día 1 (Culqi y las claves del
  # seed se completan después con `gcloud secrets versions add`).
  secret_values = merge(
    {
      "database-url"  = local.database_url
      "jwt-secret"    = var.jwt_secret
      "cookie-secret" = var.cookie_secret
    },
    var.culqi_secret_key != "" ? { "culqi-secret-key" = var.culqi_secret_key } : {},
    var.culqi_public_key != "" ? { "culqi-public-key" = var.culqi_public_key } : {},
    var.medusa_publishable_key != "" ? { "medusa-publishable-key" = var.medusa_publishable_key } : {},
    var.medusa_region_id != "" ? { "medusa-region-id" = var.medusa_region_id } : {},
  )

  # Env de Cloud Run que referencia secretos (solo los disponibles).
  backend_secret_env = merge(
    {
      DATABASE_URL  = "database-url"
      JWT_SECRET    = "jwt-secret"
      COOKIE_SECRET = "cookie-secret"
    },
    var.culqi_secret_key != "" ? { CULQI_SECRET_KEY = "culqi-secret-key" } : {},
    var.culqi_public_key != "" ? { CULQI_PUBLIC_KEY = "culqi-public-key" } : {},
  )

  storefront_secret_env = merge(
    var.medusa_publishable_key != "" ? { MEDUSA_PUBLISHABLE_KEY = "medusa-publishable-key" } : {},
    var.medusa_region_id != "" ? { MEDUSA_REGION_ID = "medusa-region-id" } : {},
    var.culqi_secret_key != "" ? { CULQI_SECRET_KEY = "culqi-secret-key" } : {},
  )
}

# --- Habilitar APIs ---
resource "google_project_service" "apis" {
  for_each           = toset(local.services)
  service            = each.value
  disable_on_destroy = false
}

# --- Artifact Registry (imágenes Docker) ---
resource "google_artifact_registry_repository" "cavi" {
  location      = var.region
  repository_id = "cavi"
  format        = "DOCKER"
  description   = "Imágenes de CAVI STORE (storefront y backend)"
  depends_on    = [google_project_service.apis]
}

# --- Cloud SQL (PostgreSQL 16) ---
resource "google_sql_database_instance" "pg" {
  name             = "cavi-pg"
  database_version = "POSTGRES_16"
  region           = var.region
  depends_on       = [google_project_service.apis]

  settings {
    tier              = var.db_tier
    edition           = "ENTERPRISE" # el tier db-custom-* pertenece a esta edición
    availability_type = "ZONAL"      # sube a REGIONAL para alta disponibilidad
    disk_type         = "PD_SSD"
    disk_size         = 10
    disk_autoresize   = true

    backup_configuration {
      enabled                        = true
      point_in_time_recovery_enabled = true
      start_time                     = "06:00" # UTC
    }

    ip_configuration {
      ipv4_enabled = true # acceso vía conector Cloud Run (socket), no público directo
    }
  }

  deletion_protection = var.deletion_protection
}

resource "google_sql_database" "db" {
  name     = local.db_name
  instance = google_sql_database_instance.pg.name
}

resource "google_sql_user" "user" {
  name     = local.db_user
  instance = google_sql_database_instance.pg.name
  password = var.db_password
}

# --- Secret Manager ---
resource "google_secret_manager_secret" "s" {
  for_each  = local.secret_values
  secret_id = each.key
  replication {
    auto {}
  }
  depends_on = [google_project_service.apis]
}

resource "google_secret_manager_secret_version" "v" {
  for_each    = local.secret_values
  secret      = google_secret_manager_secret.s[each.key].id
  secret_data = each.value
}
# Los secretos que aún no tienen valor (Culqi, publishable/region del seed) se
# agregan después SIN re-aplicar Terraform, pasando la variable correspondiente
# o directamente:
#   printf '%s' "$VALOR" | gcloud secrets versions add culqi-secret-key --data-file=-
# y luego un nuevo deploy del servicio para que tome la versión "latest".

# --- Service Account para Cloud Run ---
resource "google_service_account" "run" {
  account_id   = "cavi-run"
  display_name = "CAVI Cloud Run runtime"
}

resource "google_project_iam_member" "run_sql" {
  project = var.project_id
  role    = "roles/cloudsql.client"
  member  = "serviceAccount:${google_service_account.run.email}"
}

resource "google_project_iam_member" "run_secrets" {
  project = var.project_id
  role    = "roles/secretmanager.secretAccessor"
  member  = "serviceAccount:${google_service_account.run.email}"
}

# --- Redis (Memorystore) + VPC connector, opcional ---
resource "google_vpc_access_connector" "connector" {
  count         = var.enable_redis ? 1 : 0
  name          = "cavi-vpc"
  region        = var.region
  network       = "default"
  ip_cidr_range = "10.8.0.0/28"
  depends_on    = [google_project_service.apis]
}

resource "google_redis_instance" "redis" {
  count          = var.enable_redis ? 1 : 0
  name           = "cavi-redis"
  tier           = "BASIC"
  memory_size_gb = 1
  region         = var.region
  redis_version  = "REDIS_7_0"
  depends_on     = [google_project_service.apis]
}

# --- Cloud Run: Backend Medusa ---
resource "google_cloud_run_v2_service" "backend" {
  name     = "cavi-backend"
  location = var.region
  ingress  = "INGRESS_TRAFFIC_ALL"

  template {
    service_account = google_service_account.run.email
    scaling {
      min_instance_count = 0
      max_instance_count = 5
    }

    dynamic "vpc_access" {
      for_each = var.enable_redis ? [1] : []
      content {
        connector = google_vpc_access_connector.connector[0].id
        egress    = "PRIVATE_RANGES_ONLY"
      }
    }

    volumes {
      name = "cloudsql"
      cloud_sql_instance {
        instances = [local.conn_name]
      }
    }

    containers {
      image = var.backend_image
      ports {
        container_port = 9000
      }
      volume_mounts {
        name       = "cloudsql"
        mount_path = "/cloudsql"
      }

      env {
        name  = "NODE_ENV"
        value = "production"
      }
      env {
        name  = "STORE_CORS"
        value = "*"
      }
      env {
        name  = "ADMIN_CORS"
        value = "*"
      }
      env {
        name  = "AUTH_CORS"
        value = "*"
      }
      dynamic "env" {
        for_each = var.enable_redis ? [1] : []
        content {
          name  = "REDIS_URL"
          value = "redis://${google_redis_instance.redis[0].host}:${google_redis_instance.redis[0].port}"
        }
      }
      dynamic "env" {
        for_each = local.backend_secret_env
        content {
          name = env.key
          value_source {
            secret_key_ref {
              secret  = google_secret_manager_secret.s[env.value].secret_id
              version = "latest"
            }
          }
        }
      }
    }
  }

  # El CI/CD gestiona la imagen; evita que Terraform la revierta.
  lifecycle {
    ignore_changes = [template[0].containers[0].image]
  }

  depends_on = [google_secret_manager_secret_version.v]
}

# --- Cloud Run Job: migraciones de la BD (Medusa) ---
resource "google_cloud_run_v2_job" "migrate" {
  name     = "cavi-migrate"
  location = var.region

  template {
    template {
      service_account = google_service_account.run.email
      max_retries     = 1

      volumes {
        name = "cloudsql"
        cloud_sql_instance {
          instances = [local.conn_name]
        }
      }

      containers {
        image   = var.backend_image
        command = ["npx"]
        args    = ["medusa", "db:migrate"]
        volume_mounts {
          name       = "cloudsql"
          mount_path = "/cloudsql"
        }
        env {
          name = "DATABASE_URL"
          value_source {
            secret_key_ref {
              secret  = google_secret_manager_secret.s["database-url"].secret_id
              version = "latest"
            }
          }
        }
      }
    }
  }

  lifecycle {
    ignore_changes = [template[0].template[0].containers[0].image]
  }

  depends_on = [google_secret_manager_secret_version.v]
}

# --- Cloud Run: Storefront ---
resource "google_cloud_run_v2_service" "storefront" {
  name     = "cavi-storefront"
  location = var.region
  ingress  = "INGRESS_TRAFFIC_ALL"

  template {
    service_account = google_service_account.run.email
    scaling {
      min_instance_count = 0
      max_instance_count = 10
    }
    containers {
      image = var.storefront_image
      ports {
        container_port = 8080
      }
      env {
        name  = "MEDUSA_BACKEND_URL"
        value = google_cloud_run_v2_service.backend.uri
      }
      # Analítica → BigQuery (usa el token del metadata server, sin claves).
      env {
        name  = "GCP_PROJECT_ID"
        value = var.project_id
      }
      env {
        name  = "BQ_EVENTS_DATASET"
        value = google_bigquery_dataset.raw.dataset_id
      }
      env {
        name  = "BQ_EVENTS_TABLE"
        value = google_bigquery_table.raw_events.table_id
      }
      dynamic "env" {
        for_each = local.storefront_secret_env
        content {
          name = env.key
          value_source {
            secret_key_ref {
              secret  = google_secret_manager_secret.s[env.value].secret_id
              version = "latest"
            }
          }
        }
      }
    }
  }

  lifecycle {
    ignore_changes = [template[0].containers[0].image]
  }

  depends_on = [google_secret_manager_secret_version.v]
}

# --- Acceso público (sin auth) a ambos servicios ---
resource "google_cloud_run_v2_service_iam_member" "backend_public" {
  location = var.region
  name     = google_cloud_run_v2_service.backend.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}

resource "google_cloud_run_v2_service_iam_member" "storefront_public" {
  location = var.region
  name     = google_cloud_run_v2_service.storefront.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}
