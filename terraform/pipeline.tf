# Dev Environment resources
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
  }

  include_build_logs = "INCLUDE_BUILD_LOGS_WITH_STATUS"
}

# QA Environment resources
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
  }

  include_build_logs = "INCLUDE_BUILD_LOGS_WITH_STATUS"
}

# Prod Environment Resources
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
  }

  include_build_logs = "INCLUDE_BUILD_LOGS_WITH_STATUS"
}
