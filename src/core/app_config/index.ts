import type { BackendFeed } from '~core/auth/types';

export interface AppConfig {
  API_GATEWAY: string;
  BOUNDARIES_API: string;
  REPORTS_API: string;
  BIVARIATE_TILES_RELATIVE_URL: string;
  BIVARIATE_TILES_SERVER?: string;
  BIVARIATE_TILES_INDICATORS_CLASS: string;
  REFRESH_INTERVAL_SEC: number;
  MAP_ACCESS_TOKEN: string;
  MAP_BASE_STYLE: string;
  LAYERS_BY_DEFAULT: string[];
  KEYCLOAK_URL: string;
  KEYCLOAK_REALM: string;
  KEYCLOAK_CLIENT_ID: string;
  YANDEX_METRICA_ID?: number[];
  AUTOFOCUS_PADDINGS: [number, number, number, number];
  AUTOFOCUS_ZOOM: number;
  INTERCOM_DEFAULT_NAME?: string;
  INTERCOM_APP_ID?: string;
  INTERCOM_SELECTOR?: string;
  FEATURES_BY_DEFAULT: string[];
  DEFAULT_FEED: string;
  DEFAULT_FEED_OBJECT: BackendFeed;
}

declare global {
  interface Window {
    konturAppConfig: AppConfig;
  }
}

export default (() => {
  const konturAppConfig = globalThis.window.konturAppConfig ?? {};
  return {
    apiGateway: konturAppConfig.API_GATEWAY,
    boundariesApi: konturAppConfig.BOUNDARIES_API,
    reportsApi: konturAppConfig.REPORTS_API,
    bivariateTilesRelativeUrl: konturAppConfig.BIVARIATE_TILES_RELATIVE_URL,
    bivariateTilesServer: konturAppConfig.BIVARIATE_TILES_SERVER,
    bivariateTilesIndicatorsClass: konturAppConfig.BIVARIATE_TILES_INDICATORS_CLASS,
    refreshIntervalSec: konturAppConfig.REFRESH_INTERVAL_SEC,
    mapAccessToken: konturAppConfig.MAP_ACCESS_TOKEN,
    mapBaseStyle: konturAppConfig.MAP_BASE_STYLE,
    layersByDefault: konturAppConfig.LAYERS_BY_DEFAULT,
    featuresByDefault: konturAppConfig.FEATURES_BY_DEFAULT,
    defaultFeed: konturAppConfig.DEFAULT_FEED,
    defaultFeedObject: konturAppConfig.DEFAULT_FEED_OBJECT,
    keycloakUrl: konturAppConfig.KEYCLOAK_URL,
    keycloakRealm: konturAppConfig.KEYCLOAK_REALM,
    keycloakClientId: konturAppConfig.KEYCLOAK_CLIENT_ID,
    yandexMetricaId: konturAppConfig.YANDEX_METRICA_ID,
    baseUrl: import.meta.env?.VITE_BASE_PATH,
    isDevBuild: import.meta.env?.DEV,
    isProdBuild: import.meta.env?.PROD,
    appVersion: import.meta.env?.PACKAGE_VERSION as string,
    autoFocus: {
      desktopPaddings: {
        top: konturAppConfig.AUTOFOCUS_PADDINGS?.[0] ?? 0,
        right: konturAppConfig.AUTOFOCUS_PADDINGS?.[1] ?? 0, // Layers list panel
        bottom: konturAppConfig.AUTOFOCUS_PADDINGS?.[2] ?? 0,
        left: konturAppConfig.AUTOFOCUS_PADDINGS?.[3] ?? 0, // communities/analytics panel + paddings
      },
      maxZoom: konturAppConfig.AUTOFOCUS_ZOOM,
    },
    intercom: {
      name: konturAppConfig.INTERCOM_DEFAULT_NAME,
      app_id: konturAppConfig.INTERCOM_APP_ID,
      custom_launcher_selector: konturAppConfig.INTERCOM_SELECTOR,
    },
  };
})();

if (import.meta.env?.PROD) {
  console.info(
    `%c Disaster Ninja ${import.meta.env.PACKAGE_VERSION} deployment:
  - Build Time: ${import.meta.env.BUILD_TIME}
  - Git Branch: ${import.meta.env.GIT_BRANCH}
  - Git Commit: #${import.meta.env.GIT_COMMIT_HASH}
  - Git Commit Time: ${import.meta.env.GIT_COMMIT_TIME}
  `,
    'color: #bada55',
  );
}
