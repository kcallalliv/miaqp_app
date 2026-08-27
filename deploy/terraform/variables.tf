variable "project_id" {
  type        = string
  description = "ID del proyecto de GCP (lo creas en southamerica-west1)."
}

variable "region" {
  type        = string
  default     = "southamerica-west1" # Santiago — menor latencia a Perú
  description = "Región de despliegue."
}

variable "db_tier" {
  type        = string
  default     = "db-custom-1-3840" # 1 vCPU, 3.75 GB. Sube según carga.
  description = "Tier de la instancia Cloud SQL."
}

variable "db_password" {
  type        = string
  sensitive   = true
  description = "Contraseña del usuario de la base de datos (guárdala segura)."
}

variable "jwt_secret" {
  type        = string
  sensitive   = true
  description = "JWT secret de Medusa."
}

variable "cookie_secret" {
  type        = string
  sensitive   = true
  description = "Cookie secret de Medusa."
}

variable "culqi_secret_key" {
  type        = string
  sensitive   = true
  default     = "" # Se completa cuando tengas la cuenta Culqi.
  description = "Clave privada de Culqi (sk_...)."
}

variable "culqi_public_key" {
  type        = string
  default     = ""
  description = "Clave pública de Culqi (pk_...)."
}

variable "whatsapp_number" {
  type        = string
  default     = "51966538608"
  description = "Número de WhatsApp del negocio (sin + ni espacios)."
}

variable "medusa_publishable_key" {
  type        = string
  default     = "" # Sale del seed (npm run seed:cavi). Déjalo vacío hasta tenerlo.
  description = "Publishable key de Medusa para el storefront (pk_...)."
}

variable "medusa_region_id" {
  type        = string
  default     = "" # Sale del seed. Déjalo vacío hasta tenerlo.
  description = "Region ID (PEN) de Medusa (reg_...)."
}

variable "enable_redis" {
  type        = bool
  default     = false
  description = "Provisiona Memorystore (Redis) + VPC connector para Medusa."
}

variable "enable_datastream" {
  type        = bool
  default     = false
  description = "Provisiona el stream CDC Cloud SQL → BigQuery (requiere configurar conectividad y logical decoding; ver warehouse/README.md)."
}

variable "deletion_protection" {
  type        = bool
  default     = true
  description = "Protección contra borrado de Cloud SQL."
}

# Imágenes de contenedor. Por defecto un placeholder; el CI/CD las actualiza.
variable "storefront_image" {
  type        = string
  default     = "us-docker.pkg.dev/cloudrun/container/hello"
}

variable "backend_image" {
  type        = string
  default     = "us-docker.pkg.dev/cloudrun/container/hello"
}
