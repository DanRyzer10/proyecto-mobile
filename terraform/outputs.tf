output "app_service_url" {
  description = "URL del App Service"
  value       = "https://${azurerm_linux_web_app.app.default_hostname}"
}

output "app_service_name" {
  description = "Nombre del App Service"
  value       = azurerm_linux_web_app.app.name
}

output "resource_group_name" {
  description = "Nombre del Resource Group"
  value       = azurerm_resource_group.rg.name
}

output "application_insights_key" {
  description = "Instrumentation Key de Application Insights"
  value       = azurerm_application_insights.ai.instrumentation_key
  sensitive   = true
}

output "key_vault_url" {
  description = "URL del Key Vault"
  value       = azurerm_key_vault.kv.vault_uri
}