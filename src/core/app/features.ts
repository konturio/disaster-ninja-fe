import { appConfig } from '~core/app_config';
import { featureFlagsAtom } from '~core/shared_state';
import type { BackendFeature } from '~core/auth/types';
import type { ApiClient } from '~core/api_client';

export function loadFeatures(
  apiClient: ApiClient,
  useAuth: boolean,
): Promise<BackendFeature[] | null> {
  const featuresResponse = apiClient.get<BackendFeature[]>(
    `/features`,
    { appId: appConfig.id },
    useAuth,
  );
  return featuresResponse;
}

export function setFeatures(value: BackendFeature[] | null) {
  // FIXME: investigate proper app and user feature merge
  const newFeatures = {};
  value?.forEach((ft) => {
    newFeatures[ft.name] = true;
  });
  featureFlagsAtom.set.dispatch(newFeatures);
}
