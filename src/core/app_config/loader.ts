export async function loadConfig() {
  const pathname = window.location.pathname;
  const url = pathname.includes('/active/')
    ? '/active/config/appconfig.json'
    : '/config/appconfig.json';
  const response = await fetch(url);
  // Here we can add runtime config check.
  // Example in scripts/build-config-scheme.mjs
  const config = await response.json();
  globalThis.konturAppConfig = config;
}
