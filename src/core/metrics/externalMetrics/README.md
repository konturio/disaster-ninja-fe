# External Metrics

This folder contains implementations used to integrate third party analytics systems.

## Matomo Tag Manager

`MatomoMetrics` dynamically loads the Matomo Tag Manager container and pushes metric events to the `_mtm` data layer. The container URL is read from `configRepo.get().matomoContainerUrl`.

The metrics system initializes external trackers only after the user grants the **GTM** cookie permission (see `cookie_settings`). Once enabled, events dispatched via `dispatchMetricsEvent` are forwarded to Google Tag Manager, Yandex Metrica, and Matomo Tag Manager.
