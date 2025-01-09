import { apiClient } from '~core/apiClientInstance';
import { AUTH_REQUIREMENT } from '~core/auth/constants';
import type { AxisTransformationWithPoints } from '~utils/bivariate';
import type { AxisDTO } from '~core/resources/bivariateStatisticsResource/types';

export function getBivariateAxes(minQuality: number, abortController?: AbortController) {
  if (minQuality < 0 || minQuality > 1) {
    throw new Error('minQuality must be >= 0 and <= 1');
  }
  return apiClient.get<AxisDTO[]>(`/axis?minQuality=${minQuality}`, undefined, {
    signal: abortController ? abortController.signal : undefined,
    authRequirement: AUTH_REQUIREMENT.MUST,
  });
}

export function getAxisTransformations(
  numeratorName: string,
  denominatorName: string,
  abortController?: AbortController,
) {
  return apiClient.get<AxisTransformationWithPoints[]>(
    `/axis/${numeratorName}/${denominatorName}/transformations`,
    undefined,
    {
      signal: abortController ? abortController.signal : undefined,
      authRequirement: AUTH_REQUIREMENT.MUST,
    },
  );
}
