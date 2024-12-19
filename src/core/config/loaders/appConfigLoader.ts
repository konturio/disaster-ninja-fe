import { getLayersDetails } from '~core/api/layers';
import { apiClient } from '~core/apiClientInstance';
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
    {
      appId,
      ts: Date.now(), // bypass cache
    },
    true,
  );
  if (appCfg === null) throw Error('App configuration unavailable');

  let features = createFeaturesConfig(appCfg.features) as AppConfig['features'];

  const localFeatureConfigOverrides = await loadLocalFeatureConfigOverrides();
  if (Object.keys(localFeatureConfigOverrides).length > 0) {
    console.info(
      `[[[[ Applying local feature overrides from file: ${LOCAL_FEATURE_OVERRIDES_PATH} ]]]]`,
    );
    features = { ...features, ...localFeatureConfigOverrides };
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

const LOCAL_FEATURE_OVERRIDES_PATH = `${import.meta.env?.BASE_URL}config/features.local.json`;

// another fetures override, but this one allows us to set json configs
async function loadLocalFeatureConfigOverrides(): Promise<FeatureDto[]> {
  if (import.meta.env.DEV) {
    try {
      const response = await fetch(LOCAL_FEATURE_OVERRIDES_PATH);
      const featureConfigOverrides = await response.json();
      return featureConfigOverrides;
    } catch (e) {}
  }
  return [];
}
