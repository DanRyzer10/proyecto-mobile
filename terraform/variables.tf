variable "resource_group_name" {
  description = "Nombre del Resource Group"
  type        = string
  default     = "moodle-gateway-rg"
}

variable "location" {
  description = "Región de Azure"
  type        = string
  default     = "East US"
}

variable "app_name" {
  description = "Nombre del App Service (debe ser único globalmente)"
  type        = string
}

variable "app_service_sku" {
  description = "SKU del App Service Plan"
  type        = string
  default     = "F1"
}

variable "environment" {
  description = "Ambiente (dev, staging, prod)"
  type        = string
  default     = "dev"
}

variable "google_client_id" {
  description = "Google OAuth Client ID"
  type        = string
  sensitive   = true
}

variable "moodle_url" {
  description = "URL de Moodle"
  type        = string
}

variable "moodle_token" {
  description = "Token de Moodle"
  type        = string
  sensitive   = true
}

variable "google_client_secret" {
  description = "Google OAuth Client Secret"
  type        = string
  sensitive   = true
}

variable "google_auth_url" {
  description = "URL de autenticación de Google"
  type        = string
}

variable "google_redirect_uri" {
  description = "URI de redirección de Google OAuth"
  type        = string
}

variable "google_oauth_url" {
  description = "URL de OAuth de Google"
  type        = string
}

variable "google_cloud_api" {
  description = "URL de Google Cloud API"
  type        = string
}

variable "google_cloud_token_url" {
  description = "URL para obtener tokens de Google Cloud"
  type        = string
}

variable "moodle_rest_format" {
  description = "Formato REST de Moodle"
  type        = string
  default     = "json"
}

variable "jwt_secret" {
  description = "Secreto para firmar JWT"
  type        = string
  sensitive   = true
}

variable "cors_allowed_origins" {
  description = "Orígenes permitidos para CORS"
  type        = list(string)
  default     = ["*"]
}