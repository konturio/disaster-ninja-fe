import { apiClient } from '~core/apiClientInstance';
import type { AxisTransformationWithPoints } from '~utils/bivariate';
import type { AxisDTO } from '~core/resources/bivariateStatisticsResource/types';

export function getBivariateAxes(minQuality: number, abortController?: AbortController) {
  if (minQuality < 0 || minQuality > 1) {
    throw new Error('minQuality must be >= 0 and <= 1');
  }
  return apiClient.get<AxisDTO[]>(`/axis?minQuality=${minQuality}`, undefined, true, {
    signal: abortController ? abortController.signal : undefined,
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
    true,
    {
      signal: abortController ? abortController.signal : undefined,
    },
  );
}
