import { addMock, setupMocking, getMockKey } from '~utils/axios/axiosMockUtils';
import appConfig from '~core/app_config';
import type { AxiosInstance } from 'axios';

export function setupDefaultLayersMocking(axiosInstance: AxiosInstance) {
  const { baseURL } = axiosInstance.defaults;
  if (baseURL === undefined) return;

  addMock(getMockKey(baseURL, '/layers/defaults/'), {
    data: appConfig.layersByDefault,
  });

  setupMocking(axiosInstance);
}
