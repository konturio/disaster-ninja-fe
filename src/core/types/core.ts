import type { ApiClient } from '~core/api_client';

export interface AppConfigParsedI {
  apiGateway: string;
  boundariesApi: string;
  reportsApi: string;
  bivariateTilesRelativeUrl: string;
  bivariateTilesServer?: string;
  bivariateTilesIndicatorsClass: string;
  refreshIntervalSec: number;
  mapAccessToken: string;
  mapBaseStyle: string;
  layersByDefault: string[];
  /** Use this only as fallback */
  featuresByDefault: string[];
  defaultFeed: string;
  // TODO: replace it with better naming
  defaultFeedObject: {
    feed: string;
    name: string;
    description: string;
    default: boolean;
  };
  keycloakUrl: string;
  keycloakRealm: string;
  keycloakClientId: string;
  yandexMetricaId?: number[];
  baseUrl: string;
  isDevBuild: boolean;
  isProdBuild: boolean;
  appVersion: string;
  autoFocus: {
    desktopPaddings: {
      top: number;
      right: number;
      bottom: number;
      left: number;
    };
    maxZoom: number;
  };
  intercom: {
    name?: string;
    app_id?: string;
    custom_launcher_selector?: string;
  };
  osmEditors: {
    id: string;
    title: string;
    url: string;
  }[];
}

export interface AppMetricsI {
  changeUser: (user: { email: string }) => void;
  mark: (label: string) => void;
  processEvent: (type: string, payload: any) => void;
}

export type { Store as AppStore } from '@reatom/core';

export type { NotificationService } from '~core/notifications';
export interface ApiService {
  apiClient: ApiClient;
  boundariesClient: ApiClient;
  reportsClient: ApiClient;
}

export type AppInfoResponse = {
  id: string;
  name: string;
  description: string;
  ownedByUser: boolean;
  features: string[];
  sidebarIconUrl: string;
  faviconUrl: string;
  public: boolean;
};

export type { LocalizationService, I18n } from '../localization';