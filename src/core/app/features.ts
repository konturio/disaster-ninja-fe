import { appConfig } from '~core/app_config';
import { apiClient } from '~core/apiClientInstance';
import type { AppFeatureType, BackendFeature } from '~core/auth/types';

const effectiveFeatures = {};

// intersection of both, user can use his feature if app has it
function mergeFeatures(global, custom, user) {
  const res = { ...global, ...custom, ...user };
  return res;
}

export function hasFeature(f: AppFeatureType) {
  return effectiveFeatures[f];
}

export async function getFeatures(useAuth: boolean) {
  const featuresResponse = await apiClient.get<BackendFeature[]>(
    `/features`,
    { appId: appConfig.id },
    useAuth,
  );
}
