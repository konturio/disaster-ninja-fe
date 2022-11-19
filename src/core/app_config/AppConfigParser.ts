import type { AppConfig } from './types';
import type { LocalizationServiceI } from '~core/types/core';

export class AppConfigParser {
  async readConfig() {
    const response = await fetch(`${import.meta.env?.BASE_URL}config/appconfig.json`);
    // Here we can add runtime config check.
    // Example in scripts/build-config-scheme.mjs
    const config = await response.json();
    return config;
  }

  init(appConfig: AppConfig, i18n: LocalizationServiceI) {
    return {
      apiGateway: appConfig.API_GATEWAY,
      boundariesApi: appConfig.BOUNDARIES_API,
      reportsApi: appConfig.REPORTS_API,
      bivariateTilesRelativeUrl: appConfig.BIVARIATE_TILES_RELATIVE_URL,
      bivariateTilesServer: appConfig.BIVARIATE_TILES_SERVER,
      bivariateTilesIndicatorsClass: appConfig.BIVARIATE_TILES_INDICATORS_CLASS,
      refreshIntervalSec: appConfig.REFRESH_INTERVAL_SEC,
      mapAccessToken: appConfig.MAP_ACCESS_TOKEN,
      mapBaseStyle: appConfig.MAP_BASE_STYLE,
      layersByDefault: appConfig.LAYERS_BY_DEFAULT,
      featuresByDefault: appConfig.FEATURES_BY_DEFAULT,
      defaultFeed: appConfig.DEFAULT_FEED,
      defaultFeedObject: this.getDefaultFeedObject(i18n, appConfig.DEFAULT_FEED),
      keycloakUrl: appConfig.KEYCLOAK_URL,
      keycloakRealm: appConfig.KEYCLOAK_REALM,
      keycloakClientId: appConfig.KEYCLOAK_CLIENT_ID,
      yandexMetricaId: appConfig.YANDEX_METRICA_ID,
      baseUrl: import.meta.env?.VITE_BASE_PATH,
      isDevBuild: import.meta.env?.DEV,
      isProdBuild: import.meta.env?.PROD,
      appVersion: import.meta.env?.PACKAGE_VERSION as string,
      autoFocus: {
        desktopPaddings: {
          top: appConfig.AUTOFOCUS_PADDINGS?.[0] ?? 0,
          right: appConfig.AUTOFOCUS_PADDINGS?.[1] ?? 0, // Layers list panel
          bottom: appConfig.AUTOFOCUS_PADDINGS?.[2] ?? 0,
          left: appConfig.AUTOFOCUS_PADDINGS?.[3] ?? 0, // communities/analytics panel + paddings
        },
        maxZoom: appConfig.AUTOFOCUS_ZOOM,
      },
      intercom: {
        name: appConfig.INTERCOM_DEFAULT_NAME,
        app_id: appConfig.INTERCOM_APP_ID,
        custom_launcher_selector: appConfig.INTERCOM_SELECTOR,
      },
      osmEditors: appConfig.OSM_EDITORS || [
        {
          id: 'josm',
          title: 'JOSM',
          url: 'https://www.openstreetmap.org/edit?editor=remote#map=',
        },
      ],
    };
  }

  private getDefaultFeedObject(i18n: LocalizationServiceI, feed?: string) {
    // Change this solution when new default feed will be added
    if (!feed || feed !== 'kontur-public')
      console.warn('WARNING! Default feed provided via config is incorrect or absent');
    return {
      feed: 'kontur-public',
      name: i18n.t('configs.Kontur_public_feed'),
      description: i18n.t('configs.Kontur_public_feed_description'),
      default: true,
    };
  }
}
