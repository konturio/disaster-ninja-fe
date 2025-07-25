import { apiClient } from '~core/apiClientInstance';
import type { AxisDTO, AxisTransformationWithPoints } from '~utils/bivariate';

export function getBivariateAxes(minQuality: number, abortController?: AbortController) {
  if (minQuality < 0 || minQuality > 1) {
    throw new Error('minQuality must be >= 0 and <= 1');
  }
  return apiClient.get<AxisDTO[]>(`/axis?minQuality=${minQuality}`, undefined, {
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
    {
      signal: abortController ? abortController.signal : undefined,
    },
  );
}
