import { getLayersDetails } from '~core/api/layers';
import { apiClient } from '~core/apiClientInstance';
import { createFeaturesConfig } from './featuresConfigLoader';
import type { UserDto } from '~core/app/user';
import type { AppConfig, FeatureDto } from '../types';

export interface AppConfigDto {
  id: string;
  name: string;
  description: string;
  ownedByUser: boolean;
  features: FeatureDto[];
  sidebarIconUrl: string;
  faviconUrl: string;
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
