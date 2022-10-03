import {
  addMock,
  deleteMock,
  setupMocking,
  getMockKey,
} from '~utils/axios/axiosMockUtils';
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

export function mockClient(
  axiosInstance: AxiosInstance,
  overrides: Record<string, () => any>,
) {
  const { baseURL } = axiosInstance.defaults;

  Object.entries(overrides).forEach(([url, cb]) => {
    addMock(getMockKey(baseURL, url), {
      data: cb(),
    });
  });

  setupMocking(axiosInstance);
  return () => {
    Object.entries(overrides).forEach(([url, cb]) => {
      deleteMock(getMockKey(baseURL, url));
    });
  };
}
