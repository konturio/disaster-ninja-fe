import { apiClient } from '~core/apiClientInstance';
import { i18n } from '~core/localization';
import { AppFeature } from '~core/app/types';
import { configRepo } from '~core/config';
import type { CustomRequestConfig } from '~core/api_client/types';
import type { GeometryWithHash } from '~core/focused_geometry/types';

export function updateReferenceArea(referenceAreaGeometry: GeometryWithHash | null) {
  const referenceAreaConfiguration = { referenceAreaGeometry };
  return updateFeatureConfiguration(
    AppFeature.REFERENCE_AREA,
    referenceAreaConfiguration,
    {
      errorsConfig: { messages: i18n.t('reference_area.error_couldnt_save') },
    },
  );
}

function updateFeatureConfiguration(
  featureId: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  featureConfiguration: any,
  requestConfig?: CustomRequestConfig,
) {
  return apiClient.put(
    `/features/${featureId}?appId=${configRepo.get().id}`,
    featureConfiguration,
    true,
    requestConfig,
  );
}
