output "storefront_url" {
  value       = google_cloud_run_v2_service.storefront.uri
  description = "URL pública del storefront."
}

output "backend_url" {
  value       = google_cloud_run_v2_service.backend.uri
  description = "URL pública del backend Medusa (Store API + /app admin)."
}

output "artifact_registry" {
  value       = "${var.region}-docker.pkg.dev/${var.project_id}/${google_artifact_registry_repository.cavi.repository_id}"
  description = "Ruta base del repositorio de imágenes."
}

output "cloudsql_connection_name" {
  value       = google_sql_database_instance.pg.connection_name
  description = "Connection name de Cloud SQL (proyecto:región:instancia)."
}

output "run_service_account" {
  value       = google_service_account.run.email
  description = "Service account de runtime de Cloud Run."
}
