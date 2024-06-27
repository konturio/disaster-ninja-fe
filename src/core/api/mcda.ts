import { apiClient } from '~core/apiClientInstance';
import type { AxisDTO } from '~features/bivariate_manager/types';

export function getMcdaAxes(abortController?: AbortController) {
  return apiClient.get<AxisDTO[]>('/axis', undefined, true, {
    signal: abortController ? abortController.signal : undefined,
  });
}
