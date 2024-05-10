import { apiClient } from '~core/apiClientInstance';
import { i18n } from '~core/localization';
import { AppFeature } from '~core/auth/types';
import { configRepo } from '~core/config';
import type { CustomRequestConfig } from '~core/api_client/types';
import type { GeometryWithHash } from '~core/focused_geometry/types';

export function updateReferenceArea(referenceAreaGeometry: GeometryWithHash | null) {
  return updateFeatureConfiguration(AppFeature.REFERENCE_AREA, referenceAreaGeometry, {
    errorsConfig: { messages: i18n.t('reference_area.error_couldnt_save') },
  });
}

function updateFeatureConfiguration(
  featureId: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  configuration: any,
  requestConfig?: CustomRequestConfig,
) {
  return apiClient.put(
    `/features/${featureId}?appId=${configRepo.get().id}`,
    configuration,
    true,
    requestConfig,
  );
}
