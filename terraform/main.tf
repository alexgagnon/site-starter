terraform {
  required_version = "~> 1.18"
  required_providers {
    namecheap = {
      source = "namecheap/namecheap"
      version = "~> 2.0.0"
    }

    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.0"
    }
  }
}

# Namecheap API credentials
provider "namecheap" {
  user_name = "user"
  api_user = "user"
  api_key = "key"
  client_ip = "123.123.123.123"
  use_sandbox = false
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}

resource "cloudflare_zone" "example" {
  account = "f037e56e89293a057740de681ac9abbe"
  name       = "example.com"
}

resource "namecheap_domain_records" "dr" {
  domain = "my-domain2.com"
  nameservers = cloudflare_zone.example.nameservers
}

resource "cloudflare_pages_project" "basic_project" {
  account_id        = "f037e56e89293a057740de681ac9abbe"
  name              = "this-is-my-project-01"
  production_branch = "main"
}
