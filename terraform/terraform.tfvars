# Configuración específica del ambiente
app_name             = "moodle-oauth-gateway-angel"
location             = "East US"
environment          = "development"
app_service_sku      = "F1"

# URLs y configuraciones
moodle_url           = "https://tu-moodle.com"
cors_allowed_origins = [
  "https://tu-app-movil.com",
  "http://localhost:3000"
]

# Secrets (NO commitear este archivo, usar variables de entorno)
google_client_id     = "xxx.apps.googleusercontent.com"