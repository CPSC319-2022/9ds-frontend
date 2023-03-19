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