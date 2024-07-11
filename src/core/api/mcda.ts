import { apiClient } from '~core/apiClientInstance';
import type { AxisDTO } from '~core/resources/bivariateStatisticsResource/types';

export function getBivariateAxes(minQuality: number, abortController?: AbortController) {
  if (minQuality < 0 || minQuality > 1) {
    throw new Error('minQuality must be >= 0 and <= 1');
  }
  return apiClient.get<AxisDTO[]>(`/axis?minQuality=${minQuality}`, undefined, true, {
    signal: abortController ? abortController.signal : undefined,
  });
}
