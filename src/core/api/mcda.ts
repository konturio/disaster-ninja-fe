import { apiClient } from '~core/apiClientInstance';
import type { AxisDTO } from '~features/bivariate_manager/types';

export function getMcdaAxes() {
  return apiClient.get<AxisDTO[]>('/axis', undefined, true);
}
