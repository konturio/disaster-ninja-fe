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
