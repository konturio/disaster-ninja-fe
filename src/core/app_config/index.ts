import { i18n } from '~core/localization';
import type {
  AppConfig,
  AppInfoResponse,
  AppConfigEffective,
  AppConfigGlobal,
} from '~core/app/types';

declare global {
  interface Window {
    konturAppConfig: AppConfig;
  }
}

const configs = {
  global: {} as AppConfigGlobal,
  custom: {} as AppInfoResponse,
  merged: {} as AppConfigEffective,
};

export function updateAppConfig(appInfo: AppInfoResponse) {
  configs.custom = appInfo;
  getEffectiveConfig();
}

function getGlobalConfig(): AppConfigGlobal {
  const konturAppConfig: AppConfig = globalThis.konturAppConfig ?? {};
  const globalAppConfig = {
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
    defaultFeedObject: getDefaultFeedObject(konturAppConfig.DEFAULT_FEED), // translation should occur later after i18n init, getDefaultFeedObject(konturAppConfig.DEFAULT_FEED),
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
    osmEditors: konturAppConfig.OSM_EDITORS || [
      {
        id: 'josm',
        title: 'JOSM',
        url: 'https://www.openstreetmap.org/edit?editor=remote#map=',
      },
    ],
    effectiveFeatures: {},
  };
  configs['global'] = globalAppConfig;
  return globalAppConfig;
}

function getEffectiveFeatures(appConfig: AppConfigEffective) {
  return Object.fromEntries(
    [...appConfig.featuresByDefault, ...(appConfig.features ?? [])].map((k) => [k, true]),
  );
}

function getEffectiveConfig(): AppConfigEffective {
  getGlobalConfig();
  const mergedAppConfig = { ...configs.global, ...configs.custom };
  mergedAppConfig.effectiveFeatures = getEffectiveFeatures(mergedAppConfig);
  // mutate object to keep reference for export
  Object.assign(configs.merged, mergedAppConfig);
  return mergedAppConfig;
}

getEffectiveConfig();

const effectiveConfig = configs.merged;

export default effectiveConfig;

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

export function getDefaultFeedObject(feed?: string) {
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
