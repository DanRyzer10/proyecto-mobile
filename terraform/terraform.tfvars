# Configuración específica del ambiente
app_name             = "moodle-oauth-gateway-angel"
location             = "East US"
environment          = "development"
app_service_sku      = "F1"

# URLs y configuraciones
cors_allowed_origins = [
  "*",
]

google_client_id     = "991649542240-a1tv2unq594n845v4jm9u2tsc6cn3o8j.apps.googleusercontent.com"
google_client_secret = "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"
google_auth_url      = "https://accounts.google.com/o/oauth2/v2/auth"
google_redirect_uri  = "http://localhost:3000/auth/google/callback"
google_oauth_url     = "https://accounts.google.com/o/oauth2/v2/auth"
google_cloud_api     = "https://www.googleapis.com"
google_cloud_token_url = "https://oauth2.googleapis.com"
moodle_token         = "ebbf0a6defcdcafb143b382ec80274d0"
moodle_rest_format   = "json"
moodle_url           = "http://150.136.56.67:8080/webservice/rest/server.php"
jwt_secret = "pepitojuarezxdxd"