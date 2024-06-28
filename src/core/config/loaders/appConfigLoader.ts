import { getLayersDetails } from '~core/api/layers';
import { apiClient } from '~core/apiClientInstance';
import {
  SUBSCRIPTION_CONFIG_OVERRIDE,
  USE_MOCK_SUBSCRIPTION_CONFIG,
} from '~features/subscriptions/components/PricingContent/mockSubscriptionConfig';
import { createFeaturesConfig } from './featuresConfigLoader';
import type { UserDto } from '~core/app/user';
import type { AppConfig, FaviconPack, FeatureDto } from '../types';

export interface AppConfigDto {
  id: string;
  name: string;
  description: string;
  ownedByUser: boolean;
  features: FeatureDto[];
  sidebarIconUrl: string;
  faviconUrl: string;
  faviconPack: FaviconPack;
  public: boolean;
  extent: [number, number, number, number];
  user?: UserDto;
}

export async function getAppConfig(appId?: string): Promise<AppConfig> {
  // In case appId absent in url - backend identifying it by domain
  const appCfg = await apiClient.get<AppConfigDto>(
    '/apps/configuration',
    { appId },
    true,
  );
  if (appCfg === null) throw Error('App configuration unavailable');

  const features = createFeaturesConfig(appCfg.features) as AppConfig['features'];
  if (USE_MOCK_SUBSCRIPTION_CONFIG) {
    features.subscription = SUBSCRIPTION_CONFIG_OVERRIDE.configuration;
  }

  return {
    ...appCfg,
    features,
  };
}

export async function getLayerSourceUrl(
  layerId: string,
  appId: string,
  language: string,
) {
  const basemapInUrlDetails = await getLayersDetails([layerId], appId, language);
  return basemapInUrlDetails[0]?.source?.urls?.at(0);
}
