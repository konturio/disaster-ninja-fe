import { appConfig } from '~core/app_config';
import { featureFlagsAtom } from '~core/shared_state';
import { createBooleanAtom } from '~utils/atoms';
import { store } from '~core/store/store';
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

export const featuresWereSetAtom = createBooleanAtom(false, 'featuresWereSetAtom');

export function setFeatures(value: BackendFeature[] | null) {
  // FIXME: investigate proper app and user feature merge
  const newFeatures = {};
  value?.forEach((ft) => {
    newFeatures[ft.name] = true;
  });
  featureFlagsAtom.set.dispatch(newFeatures);
  store.dispatch([featureFlagsAtom.set(newFeatures), featuresWereSetAtom.setTrue()]);
}
