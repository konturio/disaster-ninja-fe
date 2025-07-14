# Metrics System

This module collects application events and forwards them to external analytics providers.
Currently supported providers are Google Tag Manager, Yandex Metrica and Matomo Tag Manager.

External metrics are initialized only when the user grants the `GTM` cookie permission.
`initMetricsOnce` in `src/core/metrics/index.ts` wires all providers together.

## Matomo integration

`MatomoMetrics` dynamically injects the Matomo container script and listens for
internal `METRICS` events. Every event is pushed to Matomo's data layer
including the current `app_id` from configuration. The implementation resides in
`src/core/metrics/externalMetrics/matomoMetrics.ts`.
