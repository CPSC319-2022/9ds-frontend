# Dev Environment resources
resource "google_storage_bucket_object" "dev_deployment_reader_archive" {
  provider = google.dev
  name     = "latest-deployment-reader.zip"
  bucket   = google_storage_bucket.dev_bucket.name
  source   = "latest-deployment-reader.zip"
}

resource "google_cloudfunctions_function" "dev_readDeployment" {
  provider      = google.dev
  name          = "readDeployment"
  description   = "Latest Deployment Reader deployed using tf"
  runtime       = "nodejs18"
  region        = "us-west2"
  max_instances = 50

  available_memory_mb   = 128
  source_archive_bucket = google_storage_bucket.dev_bucket.name
  source_archive_object = google_storage_bucket_object.dev_deployment_reader_archive.name
  entry_point           = "readDeployment"

  trigger_http = true
}

resource "google_cloudfunctions_function_iam_binding" "dev_invoker" {
  provider       = google.dev
  project        = google_cloudfunctions_function.dev_readDeployment.project
  region         = google_cloudfunctions_function.dev_readDeployment.region
  cloud_function = google_cloudfunctions_function.dev_readDeployment.name
  role           = "roles/cloudfunctions.invoker"
  members        = ["allUsers"]
}

resource "google_cloudbuild_trigger" "tf-feature-build" {
  provider = google.dev
  location = "us-west2"
  name     = "tf-feature-build"
  filename = "feature_cloudbuild.yaml"

  github {
    owner = "CPSC319-2022"
    name  = "9ds-frontend"
    push {
      branch       = "^(main|qa|prod)$"
      invert_regex = true
    }
  }

  substitutions = {
    _REACT_APP_ENV = ""
  }

  include_build_logs = "INCLUDE_BUILD_LOGS_WITH_STATUS"
}

resource "google_cloudbuild_trigger" "tf-dev-build" {
  provider = google.dev
  location = "us-west2"
  name     = "tf-dev-build"
  filename = "non_feature_cloudbuild.yaml"

  github {
    owner = "CPSC319-2022"
    name  = "9ds-frontend"
    push {
      branch       = "^main$"
      invert_regex = false
    }
  }

  substitutions = {
    _REACT_APP_ENV = "DEV"
    _CF_URL        = google_cloudfunctions_function.dev_readDeployment.https_trigger_url
  }

  include_build_logs = "INCLUDE_BUILD_LOGS_WITH_STATUS"
}

resource "google_storage_bucket_object" "dev_deploymennt_logger_archive" {
  provider = google.dev
  name     = "latest-deployment-logger.zip"
  bucket   = google_storage_bucket.dev_bucket.name
  source   = "latest-deployment-logger.zip"
}

resource "google_cloudfunctions_function" "dev_logDeployment" {
  provider      = google.dev
  name          = "logDeployment"
  description   = "Latest Deployment Logger deployed using tf"
  runtime       = "nodejs18"
  region        = "us-west2"
  max_instances = 50

  available_memory_mb   = 128
  source_archive_bucket = google_storage_bucket.dev_bucket.name
  source_archive_object = google_storage_bucket_object.dev_deploymennt_logger_archive.name
  entry_point           = "logDeployment"

  event_trigger {
    event_type = "google.pubsub.topic.publish"
    resource   = "projects/${var.dev_project_id}/topics/cloud-builds"
  }

  environment_variables = {
    TRIGGER_ID = google_cloudbuild_trigger.tf-dev-build.trigger_id
  }
}

# QA Environment resources
resource "google_storage_bucket_object" "qa_deployment_reader_archive" {
  provider = google.qa
  name     = "latest-deployment-reader.zip"
  bucket   = google_storage_bucket.qa_bucket.name
  source   = "latest-deployment-reader.zip"
}

resource "google_cloudfunctions_function" "qa_readDeployment" {
  provider      = google.qa
  name          = "readDeployment"
  description   = "Latest Deployment Reader deployed using tf"
  runtime       = "nodejs18"
  region        = "us-west2"
  max_instances = 50

  available_memory_mb   = 128
  source_archive_bucket = google_storage_bucket.qa_bucket.name
  source_archive_object = google_storage_bucket_object.qa_deployment_reader_archive.name
  entry_point           = "readDeployment"

  trigger_http = true
}

resource "google_cloudfunctions_function_iam_binding" "qa_invoker" {
  provider       = google.qa
  project        = google_cloudfunctions_function.qa_readDeployment.project
  region         = google_cloudfunctions_function.qa_readDeployment.region
  cloud_function = google_cloudfunctions_function.qa_readDeployment.name
  role           = "roles/cloudfunctions.invoker"
  members        = ["allUsers"]
}

resource "google_cloudbuild_trigger" "tf-qa-build" {
  provider = google.qa
  location = "us-west2"
  name     = "tf-qa-build"
  filename = "non_feature_cloudbuild.yaml"

  github {
    owner = "CPSC319-2022"
    name  = "9ds-frontend"
    push {
      branch       = "^qa$"
      invert_regex = false
    }
  }

  substitutions = {
    _REACT_APP_ENV = "QA"
    _CF_URL        = google_cloudfunctions_function.qa_readDeployment.https_trigger_url
  }

  include_build_logs = "INCLUDE_BUILD_LOGS_WITH_STATUS"
}

resource "google_storage_bucket_object" "qa_deploymennt_logger_archive" {
  provider = google.qa
  name     = "latest-deployment-logger.zip"
  bucket   = google_storage_bucket.qa_bucket.name
  source   = "latest-deployment-logger.zip"
}

resource "google_cloudfunctions_function" "qa_logDeployment" {
  provider      = google.qa
  name          = "logDeployment"
  description   = "Latest Deployment Logger deployed using tf"
  runtime       = "nodejs18"
  region        = "us-west2"
  max_instances = 50

  available_memory_mb   = 128
  source_archive_bucket = google_storage_bucket.qa_bucket.name
  source_archive_object = google_storage_bucket_object.qa_deploymennt_logger_archive.name
  entry_point           = "logDeployment"

  event_trigger {
    event_type = "google.pubsub.topic.publish"
    resource   = "projects/${var.qa_project_id}/topics/cloud-builds"
  }

  environment_variables = {
    TRIGGER_ID = google_cloudbuild_trigger.tf-qa-build.trigger_id
  }
}

# Prod Environment Resources
resource "google_storage_bucket_object" "prod_deployment_reader_archive" {
  provider = google.prod
  name     = "latest-deployment-reader.zip"
  bucket   = google_storage_bucket.prod_bucket.name
  source   = "latest-deployment-reader.zip"
}

resource "google_cloudfunctions_function" "prod_readDeployment" {
  provider      = google.prod
  name          = "readDeployment"
  description   = "Latest Deployment Reader deployed using tf"
  runtime       = "nodejs18"
  region        = "us-west2"
  max_instances = 50

  available_memory_mb   = 128
  source_archive_bucket = google_storage_bucket.prod_bucket.name
  source_archive_object = google_storage_bucket_object.prod_deployment_reader_archive.name
  entry_point           = "readDeployment"

  trigger_http = true
}

resource "google_cloudfunctions_function_iam_binding" "prod_invoker" {
  provider       = google.prod
  project        = google_cloudfunctions_function.prod_readDeployment.project
  region         = google_cloudfunctions_function.prod_readDeployment.region
  cloud_function = google_cloudfunctions_function.prod_readDeployment.name
  role           = "roles/cloudfunctions.invoker"
  members        = ["allUsers"]
}

resource "google_cloudbuild_trigger" "tf-prod-build" {
  provider = google.prod
  location = "us-west2"
  name     = "tf-prod-build"
  filename = "non_feature_cloudbuild.yaml"

  github {
    owner = "CPSC319-2022"
    name  = "9ds-frontend"
    push {
      branch       = "^prod$"
      invert_regex = false
    }
  }

  substitutions = {
    _REACT_APP_ENV = "PROD"
    _CF_URL        = google_cloudfunctions_function.prod_readDeployment.https_trigger_url
  }

  include_build_logs = "INCLUDE_BUILD_LOGS_WITH_STATUS"
}

resource "google_storage_bucket_object" "prod_deploymennt_logger_archive" {
  provider = google.prod
  name     = "latest-deployment-logger.zip"
  bucket   = google_storage_bucket.prod_bucket.name
  source   = "latest-deployment-logger.zip"
}

resource "google_cloudfunctions_function" "prod_logDeployment" {
  provider      = google.prod
  name          = "logDeployment"
  description   = "Latest Deployment Logger deployed using tf"
  runtime       = "nodejs18"
  region        = "us-west2"
  max_instances = 50

  available_memory_mb   = 128
  source_archive_bucket = google_storage_bucket.prod_bucket.name
  source_archive_object = google_storage_bucket_object.prod_deploymennt_logger_archive.name
  entry_point           = "logDeployment"

  event_trigger {
    event_type = "google.pubsub.topic.publish"
    resource   = "projects/${var.prod_project_id}/topics/cloud-builds"
  }

  environment_variables = {
    TRIGGER_ID = google_cloudbuild_trigger.tf-prod-build.trigger_id
  }
}
