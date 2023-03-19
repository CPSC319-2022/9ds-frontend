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
  project     = "ds-blog-dev"
  alias       = "dev"
}

provider "google" {
  credentials = file("./gcp_keys/qa_tf_key.json")
  project     = "ds-blog-qa"
  alias       = "qa"
}

provider "google" {
  credentials = file("./gcp_keys/prod_tf_key.json")
  project     = "ds-blog-376905"
  alias       = "prod"
}