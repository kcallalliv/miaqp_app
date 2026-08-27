terraform {
  required_version = ">= 1.5"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 6.0"
    }
  }
  # Recomendado: backend remoto en GCS (descomenta tras crear el bucket).
  # backend "gcs" {
  #   bucket = "cavi-store-tfstate"
  #   prefix = "infra"
  # }
}

provider "google" {
  project = var.project_id
  region  = var.region
}
