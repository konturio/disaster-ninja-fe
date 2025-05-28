import type { UserDto } from '~core/app/user';
import type { AppFeatureType } from '~core/app/types';
import type { LayerDetailsDto } from '~core/logical_layers/types/source';
import type { UrlData } from '~core/url_store';

export type Config = {
  baseUrl: string;
  initialUrl: string;
  initialUrlData: UrlData;
  initialUser: UserDto;
  defaultLayers: LayerDetailsDto[];
  activeLayers: string[]; // Computed in boot stage
  presentationMode: boolean;
} & StageConfig &
  AppConfig;

export interface AppConfig {
  id: string;
  name: string;
  description: string;
  ownedByUser: boolean;
  features: FeaturesConfig;
  sidebarIconUrl: string;
  faviconUrl: string;
  faviconPack: FaviconPack;
  public: boolean;
  extent: [number, number, number, number];
  user?: UserDto;
}

export interface StageConfig {
  // Api gates
  apiGateway: string;
  reportsApiGateway: string;
  // Bivariate tiles
  bivariateTilesRelativeUrl: string;
  bivariateTilesIndicatorsClass: string;
  bivariateTilesServer?: string;
  // AutoRefreshService
  refreshIntervalSec: number;
  // Auth
  keycloakUrl: string;
  keycloakRealm: string;
  keycloakClientId: string;
  // Third-party services
  yandexMetricaId?: number[];
  intercomDefaultName?: string;
  intercomAppId?: string;
  intercomSelector?: string;
  // Event api config
  defaultFeed: string;
  // Map editor config
  osmEditors: OsmEditorConfig[];
  // Map config
  autofocusZoom: number;
  mapBlankSpaceId: string;
  mapBaseStyle: string;
  // App Defaults
  featuresByDefault: FeaturesConfig;
  defaultLanguage: string;
  // Sentry
  sentryDsn: string;
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

export type FeaturesConfig = Record<AppFeatureType, object | boolean>;
export interface FeatureDto {
  name: string;
  description: string;
  type: string;
  configuration: object;
}

export type FaviconPack = Record<
  | 'favicon.ico'
  | 'favicon.svg'
  | 'apple-touch-icon.png'
  | 'icon-192x192.png'
  | 'icon-512x512.png',
  string
>;

export type AboutFeatureConfig = {
  tabId: string;
  assetUrl: string;
  subTabs: {
    tabId: string;
    assetUrl?: string;
  }[];
};

export type CrossFrameOAuthProviderConfig = {
  id: string;
  type: 'cross_frame_oauth';
  name: string;
  authUrl: string;
  sessionCookie: string;
  loginButtonText: string;
  sessionCheckIntervalMs?: number;
  redirectUriParamName?: string;
};

export type LoginFeatureConfig = {
  profile_form: {
    organization_section: boolean;
    phone: boolean;
    linkedin: boolean;
  };
  auth_providers?: CrossFrameOAuthProviderConfig[];
  protectedRoutes?: string[];
};

export type EmbeddedPageConfig = {
  type: 'embedded';
  id: string;
  url: string;
};

export type CustomRouteConfig = EmbeddedPageConfig;
