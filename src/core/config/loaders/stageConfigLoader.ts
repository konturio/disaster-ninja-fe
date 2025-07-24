import { getFeaturesFromStageConfig } from './featuresConfigLoader';
import type { AppFeatureType } from '~core/app/types';
import type { AppConfig, OsmEditorConfig, StageConfig } from '../types';

export interface StageConfigLegacy {
  API_GATEWAY: string;
  REPORTS_API: string;
  BIVARIATE_TILES_RELATIVE_URL: string;
  BIVARIATE_TILES_SERVER?: string;
  BIVARIATE_TILES_INDICATORS_CLASS: string;
  REFRESH_INTERVAL_SEC: number;
  MAP_BASE_STYLE: string;
  KEYCLOAK_URL: string;
  KEYCLOAK_REALM: string;
  KEYCLOAK_CLIENT_ID: string;
  YANDEX_METRICA_ID?: number[];
  MATOMO_CONTAINER_URL?: string;
  MAP_BLANK_SPACE_ID: string;
  AUTOFOCUS_ZOOM: number;
  INTERCOM_DEFAULT_NAME?: string;
  INTERCOM_APP_ID?: string;
  INTERCOM_SELECTOR?: string;
  FEATURES_BY_DEFAULT: AppFeatureType[];
  DEFAULT_FEED: string;
  OSM_EDITORS: OsmEditorConfig[];
  DEFAULT_LANGUAGE: string;
  SENTRY_DSN: string;
}

export async function getStageConfig(): Promise<StageConfig> {
  let response: Response;
  try {
    response = await fetch(`${import.meta.env?.BASE_URL}config/appconfig.json`);
  } catch (e) {
    throw new Error(`Failed to load stage config: ${String(e)}`);
  }
  if (!response.ok) {
    throw new Error(
      `Failed to load stage config: ${response.status} ${response.statusText}`,
    );
  }
  const c = (await response.json()) as StageConfigLegacy;
  // TODO - reformat configs to new case
  return {
    apiGateway: c.API_GATEWAY,
    reportsApiGateway: c.REPORTS_API,
    bivariateTilesRelativeUrl: c.BIVARIATE_TILES_RELATIVE_URL,
    bivariateTilesIndicatorsClass: c.BIVARIATE_TILES_INDICATORS_CLASS,
    bivariateTilesServer: c.BIVARIATE_TILES_SERVER,
    refreshIntervalSec: c.REFRESH_INTERVAL_SEC,
    sentryDsn: c.SENTRY_DSN,
    keycloakUrl: c.KEYCLOAK_URL,
    keycloakRealm: c.KEYCLOAK_REALM,
    keycloakClientId: c.KEYCLOAK_CLIENT_ID,
    yandexMetricaId: c.YANDEX_METRICA_ID,
    matomoContainerUrl: c.MATOMO_CONTAINER_URL,
    intercomDefaultName: c.INTERCOM_DEFAULT_NAME,
    intercomAppId: c.INTERCOM_APP_ID,
    intercomSelector: c.INTERCOM_SELECTOR,
    defaultFeed: c.DEFAULT_FEED,
    osmEditors: c.OSM_EDITORS,
    autofocusZoom: c.AUTOFOCUS_ZOOM,
    mapBlankSpaceId: c.MAP_BLANK_SPACE_ID,
    mapBaseStyle: c.MAP_BASE_STYLE,
    defaultLanguage: c.DEFAULT_LANGUAGE,
    featuresByDefault: getFeaturesFromStageConfig(
      c.FEATURES_BY_DEFAULT,
    ) as AppConfig['features'],
  };
}
