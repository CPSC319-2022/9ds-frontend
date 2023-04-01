terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "4.51.0"
    }
  }
}

provider "google" {
  credentials = file("./gcp_keys/dev_tf_key.json")
  project     = var.dev_project_id
  alias       = "dev"
}

provider "google" {
  credentials = file("./gcp_keys/qa_tf_key.json")
  project     = var.qa_project_id
  alias       = "qa"
}

provider "google" {
  credentials = file("./gcp_keys/prod_tf_key.json")
  project     = var.prod_project_id
  alias       = "prod"
}