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
  OSM_EDITORS: OsmEditorConfig[];
}

export interface OsmEditorConfig {
  id: string;
  title: string;
  url: string;
}

export interface EventFeedConfig {
  feed: string;
  name: string;
  description: string;
  default: boolean;
}

export interface AppConfigGlobal {
  apiGateway: string;
  boundariesApi: string;
  reportsApi: string;
  bivariateTilesRelativeUrl: string;
  bivariateTilesServer: string | undefined;
  bivariateTilesIndicatorsClass: string;
  refreshIntervalSec: number;
  mapAccessToken: string;
  mapBaseStyle: string;
  layersByDefault: string[];
  featuresByDefault: string[];
  defaultFeed: string;
  defaultFeedObject: EventFeedConfig; // translation should occur later after i18n init, getDefaultFeedObject(konturAppConfig.DEFAULT_FEED),
  keycloakUrl: string;
  keycloakRealm: string;
  keycloakClientId: string;
  yandexMetricaId: number[] | undefined;
  baseUrl: any;
  isDevBuild: boolean;
  isProdBuild: boolean;
  appVersion: string;
  autoFocus: {
    desktopPaddings: {
      top: number;
      right: number; // Layers list panel
      bottom: number;
      left: number;
    };
    maxZoom: number;
  };
  intercom: {
    name: string | undefined;
    app_id: string | undefined;
    custom_launcher_selector: string | undefined;
  };
  osmEditors: OsmEditorConfig[];
  effectiveFeatures: Record<string, boolean>;
}

// from api
export type AppInfoResponse = {
  id: string;
  name: string;
  description: string;
  ownedByUser: boolean;
  features?: string[];
  sidebarIconUrl: string;
  faviconUrl: string;
  public: boolean;
};

export type AppConfigEffective = AppConfigGlobal & AppInfoResponse;
