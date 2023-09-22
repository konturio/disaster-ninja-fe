import { KONTUR_DEBUG } from '~utils/debug';
import type {
  AppConfig,
  AppConfigEffective,
  AppConfigGlobal,
  AppDto,
  EffectiveFeatures,
} from '~core/app/types';

declare global {
  interface Window {
    konturAppConfig: AppConfig;
  }
}

const configs = {
  global: {} as AppConfigGlobal, // default from static json
  custom: {} as AppDto, // updates from api
  overrides: {} as Partial<AppConfigEffective>,
  merged: {} as AppConfigEffective, // final merged
};

export function updateAppConfig(appInfo: AppDto) {
  Object.assign(configs.custom, appInfo);
  getEffectiveConfig();
}

export function updateAppConfigOverrides(overrides: Partial<AppConfigEffective>) {
  Object.assign(configs.overrides, overrides);
  getEffectiveConfig();
}

function getGlobalConfig(): AppConfigGlobal {
  const konturAppConfig: AppConfig = globalThis.konturAppConfig ?? {};
  const globalAppConfig = {
    apiGateway: konturAppConfig.API_GATEWAY,
    reportsApi: konturAppConfig.REPORTS_API,
    bivariateTilesRelativeUrl: konturAppConfig.BIVARIATE_TILES_RELATIVE_URL,
    bivariateTilesServer: konturAppConfig.BIVARIATE_TILES_SERVER,
    bivariateTilesIndicatorsClass: konturAppConfig.BIVARIATE_TILES_INDICATORS_CLASS,
    refreshIntervalSec: konturAppConfig.REFRESH_INTERVAL_SEC,
    mapBaseStyle: konturAppConfig.MAP_BASE_STYLE,
    featuresByDefault: konturAppConfig.FEATURES_BY_DEFAULT,
    defaultFeed: konturAppConfig.DEFAULT_FEED,
    keycloakUrl: konturAppConfig.KEYCLOAK_URL,
    keycloakRealm: konturAppConfig.KEYCLOAK_REALM,
    keycloakClientId: konturAppConfig.KEYCLOAK_CLIENT_ID,
    yandexMetricaId: konturAppConfig.YANDEX_METRICA_ID,
    baseUrl: import.meta.env?.VITE_BASE_PATH,
    mapBlankSpaceId: konturAppConfig.MAP_BLANK_SPACE_ID,
    autoFocus: {
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
    effectiveFeatures: {} as EffectiveFeatures,
  };
  configs['global'] = globalAppConfig;
  return globalAppConfig;
}

function getEffectiveFeatures(appConfig: AppConfigEffective): EffectiveFeatures {
  if (appConfig.features && appConfig.features.length > 0) {
    // @ts-expect-error - need to add validation that all features correct
    return Object.fromEntries(
      (appConfig.features ?? []).map((f) => [f.name, f.configuration || true]),
    );
  }
  // use defaults when got no features from api
  // @ts-expect-error - fromEntries in typescript broken - need to add this fix https://dev.to/svehla/typescript-object-fromentries-389c
  return Object.fromEntries(
    (appConfig.featuresByDefault ?? []).map((f) => [f, true] as const),
  );
}

export function getEffectiveConfig(): AppConfigEffective {
  getGlobalConfig();
  const mergedAppConfig = {
    defaultLayers: [],
    ...configs.global,
    ...configs.custom,
    ...configs.overrides,
  };
  mergedAppConfig.effectiveFeatures = getEffectiveFeatures(mergedAppConfig);
  // mutate object to keep reference for export
  Object.assign(configs.merged, mergedAppConfig);
  return mergedAppConfig;
}

getEffectiveConfig();

// implement as getter
export const appConfig = new Proxy(configs.merged, {
  get(target, property) {
    if (KONTUR_DEBUG) {
      console.warn('\u001b[1;35m appConfig\u001b[0m', property, configs.merged[property]);
    }
    return configs.merged[property];
  },
});
export default appConfig;

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
