# https://cloud.google.com/functions/docs/tutorials/terraform
# https://stackoverflow.com/questions/65444187/trigger-topic-not-working-on-terraform-resource-google-cloudfunctions-function

# Dev Environment Resources
resource "random_id" "dev_bucket_suffix" {
  byte_length = 8
}

resource "google_storage_bucket" "dev_bucket" {
  provider = google.dev
  name     = "functions-${var.dev_project_id}-${random_id.dev_bucket_suffix.hex}"
  location = "US"
}

resource "google_storage_bucket_object" "dev_archive" {
  provider = google.dev
  name     = "subscribe.zip"
  bucket   = google_storage_bucket.dev_bucket.name
  source   = "slack-notifier.zip"
}

resource "google_cloudfunctions_function" "dev_subscribe" {
  provider      = google.dev
  name          = "subscribe"
  description   = "Slack notifier deployed using tf"
  runtime       = "nodejs18"
  region        = "us-west2"
  max_instances = 50

  available_memory_mb   = 128
  source_archive_bucket = google_storage_bucket.dev_bucket.name
  source_archive_object = google_storage_bucket_object.dev_archive.name
  entry_point           = "subscribe"

  event_trigger {
    event_type = "google.pubsub.topic.publish"
    resource   = "projects/${var.dev_project_id}/topics/cloud-builds"
  }
}

# QA Environment Resources
resource "random_id" "qa_bucket_suffix" {
  byte_length = 8
}

resource "google_storage_bucket" "qa_bucket" {
  provider = google.qa
  name     = "functions-${var.qa_project_id}-${random_id.qa_bucket_suffix.hex}"
  location = "US"
}

resource "google_storage_bucket_object" "qa_archive" {
  provider = google.qa
  name     = "subscribe.zip"
  bucket   = google_storage_bucket.qa_bucket.name
  source   = "slack-notifier.zip"
}

resource "google_cloudfunctions_function" "qa_subscribe" {
  provider      = google.qa
  name          = "subscribe"
  description   = "Slack notifier deployed using tf"
  runtime       = "nodejs18"
  region        = "us-west2"
  max_instances = 50

  available_memory_mb   = 128
  source_archive_bucket = google_storage_bucket.qa_bucket.name
  source_archive_object = google_storage_bucket_object.qa_archive.name
  entry_point           = "subscribe"

  event_trigger {
    event_type = "google.pubsub.topic.publish"
    resource   = "projects/${var.qa_project_id}/topics/cloud-builds"
  }
}

# Prod Environment Resources
resource "random_id" "prod_bucket_suffix" {
  byte_length = 8
}

resource "google_storage_bucket" "prod_bucket" {
  provider = google.prod
  name     = "functions-${var.prod_project_id}-${random_id.prod_bucket_suffix.hex}"
  location = "US"
}

resource "google_storage_bucket_object" "prod_archive" {
  provider = google.prod
  name     = "subscribe.zip"
  bucket   = google_storage_bucket.prod_bucket.name
  source   = "slack-notifier.zip"
}

resource "google_cloudfunctions_function" "prod_subscribe" {
  provider      = google.prod
  name          = "subscribe"
  description   = "Slack notifier deployed using tf"
  runtime       = "nodejs18"
  region        = "us-west2"
  max_instances = 50

  available_memory_mb   = 128
  source_archive_bucket = google_storage_bucket.prod_bucket.name
  source_archive_object = google_storage_bucket_object.prod_archive.name
  entry_point           = "subscribe"

  event_trigger {
    event_type = "google.pubsub.topic.publish"
    resource   = "projects/${var.prod_project_id}/topics/cloud-builds"
  }
}