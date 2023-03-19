resource "google_cloudbuild_trigger" "test-tf-feature-build" {
  provider = google.dev
  location = "us-west2"
  name     = "test-tf-feature-build"
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

resource "google_cloudbuild_trigger" "test-tf-dev-build" {
  provider = google.dev
  location = "us-west2"
  name     = "test-tf-dev-build"
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
