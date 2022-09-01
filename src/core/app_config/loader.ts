export async function loadConfig() {
  const response = await fetch(`${import.meta.env?.BASE_URL}config/appconfig.json`);
  // Here we can add runtime config check.
  // Example in scripts/build-config-scheme.mjs
  const config = await response.json();
  globalThis.konturAppConfig = config;
}
