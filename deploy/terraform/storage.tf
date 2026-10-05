# ==================================================================
# Bucket de imágenes de producto (GCS) para el File Module de Medusa
# Medusa usa la API S3-compatible de GCS (endpoint + llaves HMAC).
# ==================================================================

resource "google_storage_bucket" "assets" {
  name                        = "${var.project_id}-cavi-assets"
  location                    = var.region
  uniform_bucket_level_access = true
  force_destroy               = false

  # Las imágenes se sirven al navegador desde el storefront.
  cors {
    origin          = ["*"]
    method          = ["GET", "HEAD"]
    response_header = ["*"]
    max_age_seconds = 3600
  }

  depends_on = [google_project_service.apis]
}

# Lectura pública de los objetos (fotos de producto visibles en la tienda).
resource "google_storage_bucket_iam_member" "assets_public" {
  bucket = google_storage_bucket.assets.name
  role   = "roles/storage.objectViewer"
  member = "allUsers"
}

# La SA de runtime puede escribir/borrar objetos (subidas desde el admin).
resource "google_storage_bucket_iam_member" "assets_writer" {
  bucket = google_storage_bucket.assets.name
  role   = "roles/storage.objectAdmin"
  member = "serviceAccount:${google_service_account.run.email}"
}

# Llaves HMAC (credenciales S3-compatible) asociadas a la SA de runtime.
resource "google_storage_hmac_key" "assets" {
  service_account_email = google_service_account.run.email
  depends_on            = [google_project_service.apis]
}

# Secretos con las llaves HMAC (no se exponen en texto plano en Cloud Run).
resource "google_secret_manager_secret" "s3_access_key_id" {
  secret_id = "s3-access-key-id"
  replication {
    auto {}
  }
  depends_on = [google_project_service.apis]
}
resource "google_secret_manager_secret_version" "s3_access_key_id" {
  secret      = google_secret_manager_secret.s3_access_key_id.id
  secret_data = google_storage_hmac_key.assets.access_id
}

resource "google_secret_manager_secret" "s3_secret_access_key" {
  secret_id = "s3-secret-access-key"
  replication {
    auto {}
  }
  depends_on = [google_project_service.apis]
}
resource "google_secret_manager_secret_version" "s3_secret_access_key" {
  secret      = google_secret_manager_secret.s3_secret_access_key.id
  secret_data = google_storage_hmac_key.assets.secret
}

locals {
  s3_bucket   = google_storage_bucket.assets.name
  s3_endpoint = "https://storage.googleapis.com"
  # URL pública base de los objetos (path-style de GCS).
  s3_file_url = "https://storage.googleapis.com/${google_storage_bucket.assets.name}"
}
