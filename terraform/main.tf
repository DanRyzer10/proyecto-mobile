terraform {
  required_version = ">=1.0"

  required_providers {
    azurerm = {
        source = "hashicorp/azurerm"
        version = "~>3.0"
    }
  }

  backend "azurerm" {
    resource_group_name = "terraform-state-rg"
    storage_account_name = "tfstateangelcan01"
    container_name = "tfstate"
    key = "moodle-gateway.tfstate"
  }
}

provider "azurerm" {
    features {
      
    }
  
}

resource "azurerm_resource_group" "rg" {
    name = var.resource_group_name
    location = var.location

    tags = {
        Environment = var.environment
        Project     = "Moodle Gateway"
    }
}

resource "azurerm_service_plan" "asp" {
    name     = "${var.app_name}-plan"
    location = azurerm_resource_group.rg.location
    resource_group_name = azurerm_resource_group.rg.name
    os_type   = "Linux"
    sku_name = var.app_service_sku

    tags = {
      Environment = var.environment
    }
}

resource "azurerm_linux_web_app" "app" {
    name = var.app_name
    location = azurerm_resource_group.rg.location
    resource_group_name = azurerm_resource_group.rg.name
    service_plan_id = azurerm_service_plan.asp.id

    https_only = true

    identity {
      type = "SystemAssigned"
    }

    site_config {
      always_on = false
      application_stack {
        node_version = "20-lts"
      }

      cors {
        allowed_origins = var.cors_allowed_origins
        support_credentials = false
      }

      health_check_path = "/health"
    }

    app_settings = {
        "WEBSITE_NODE_DEFAULT_VERSION"          = "~20"
        "SCM_DO_BUILD_DURING_DEPLOYMENT"        = "true"
        "NODE_ENV"                              = var.environment
        "PORT"                                  = "3000"
        "GOOGLE_CLIENT_ID"                      = var.google_client_id
        "GOOGLE_CLIENT_SECRET"                  = var.google_client_secret
        "GOOGLE_AUTH_URL"                       = var.google_auth_url
        "GOOGLE_REDIRECT_URI"                   = var.google_redirect_uri
        "GOOGLE_OAUTH_URL"                      = var.google_oauth_url
        "GOOGLE_CLOUD_API"                      = var.google_cloud_api
        "GOOGLE_CLOUD_TOKEN_URL"                = var.google_cloud_token_url
        "MOODLE_TOKEN"                          = var.moodle_token
        "MOODLE_REST_FORMAT"                    = var.moodle_rest_format
        "MOODLE_URL"                            = var.moodle_url
        "JWT_SECRET"                            = var.jwt_secret
        "APPINSIGHTS_INSTRUMENTATIONKEY"        = azurerm_application_insights.ai.instrumentation_key
        "APPLICATIONINSIGHTS_CONNECTION_STRING" = azurerm_application_insights.ai.connection_string
    }

    logs {
      application_logs {
        file_system_level = "Information"
      }
      http_logs {
        file_system {
          retention_in_days = 7
          retention_in_mb = 35
        }
      }
    }

    tags = {
      Environment = var.environment
    }
}

resource "azurerm_application_insights" "ai" {
    name                = "${var.app_name}-ai"
    location            = azurerm_resource_group.rg.location
    resource_group_name = azurerm_resource_group.rg.name
    application_type    = "Node.JS"
    daily_data_cap_in_gb = 0.1
    retention_in_days    = 30

    tags = {
      Environment = var.environment
    }
}

resource "azurerm_key_vault" "kv" {
    name = substr("${var.app_name}-kv", 0, 24)
    location = azurerm_resource_group.rg.location
    resource_group_name = azurerm_resource_group.rg.name
    tenant_id = data.azurerm_client_config.current.tenant_id
    sku_name = "standard"

    purge_protection_enabled = false
    access_policy {
        tenant_id = data.azurerm_client_config.current.tenant_id
        object_id = data.azurerm_client_config.current.object_id

        secret_permissions = ["Get", "List", "Set", "Delete", "Purge"]
    }

    access_policy {
        tenant_id = data.azurerm_client_config.current.tenant_id
        object_id = azurerm_linux_web_app.app.identity[0].principal_id

        secret_permissions = ["Get","List"]
    }

    tags = {
      Environment = var.environment
    }
  
}

resource "azurerm_key_vault_secret" "google_client_id" {
  name = "google-client-id"
  value = var.google_client_id
  key_vault_id = azurerm_key_vault.kv.id
}

resource "azurerm_key_vault_secret" "moodle_token" {
    name = "moodle-token"
    value = var.moodle_token
    key_vault_id = azurerm_key_vault.kv.id
}

data "azurerm_client_config" "current" {}
