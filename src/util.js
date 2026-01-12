// Constants
export const BASE_URL = "https://christian-crisologo-lrn.github.io/lrn48922-custom-question";
export const USER_ID = "labs-site";

// Environment configuration for Learnosity APIs
const ENV_CONFIG = {
  prod: {
    authorapi: "https://authorapi.learnosity.com/?latest-lts",
    items: "https://items.learnosity.com/?latest-lts",
    reports: "https://reports.learnosity.com/?latest-lts",
    baseUrl: BASE_URL,
  },
  staging: {
    authorapi: "https://authorapi.staging.learnosity.com/?latest-lts",
    items: "https://items.staging.learnosity.com/?latest-lts",
    reports: "https://reports.staging.learnosity.com/?latest-lts",
    baseUrl: BASE_URL,
  },
  dev: {
    authorapi: "https://authorapi.dev.learnosity.com/?latest-lts",
    items: "https://items.dev.learnosity.com/?latest-lts",
    reports: "https://reports.dev.learnosity.com/?latest-lts",
    baseUrl: "http://localhost:8081",
  },
};

// Get query parameter value from URL
export function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// Get environment configuration based on query parameter
export function getEnvConfig() {
  const env = getQueryParam("env") || "prod";
  return ENV_CONFIG[env] || ENV_CONFIG.prod;
}

// Get the script URL for a specific Learnosity API
export function getScriptUrl(api) {
  const config = getEnvConfig();
  return config[api] || config.items;
}

// Get the base URL for custom question resources
export function getBaseUrl() {
  const config = getEnvConfig();
  return config.baseUrl;
}

// Get activity template ID from query param or default
export function getActivityTemplateId() {
  return getQueryParam("activityId") || "TestActivitySB";
}