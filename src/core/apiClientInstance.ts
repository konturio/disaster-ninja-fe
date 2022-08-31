import { matchPath } from 'react-router';
import { enableMocking } from '~utils/axios/axiosMockUtils';
import history from '~core/history';
import { setupDefaultLayersMocking } from '~utils/axios/setupTemporaryMocking';
import { ApiClient } from './api_client';
import config from './app_config';
import { i18n } from './localization';
import { notificationServiceInstance } from './notificationServiceInstance';
import { APP_ROUTES } from './app_config/appRoutes';

// initialize main api client
ApiClient.init({
  notificationService: notificationServiceInstance,
  baseURL: config.apiGateway,
  loginApiPath: `${config.keycloakUrl}/auth/realms/${config.keycloakRealm}/protocol/openid-connect/token`,
  refreshTokenApiPath: `${config.keycloakUrl}/auth/realms/${config.keycloakRealm}/protocol/openid-connect/token`,
  translationService: i18n,
  unauthorizedCallback: apiClientUnauthorizedCallback,
});
const apiClientInstance = ApiClient.getInstance();

// @ts-ignore TODO: implement more legal way
setupDefaultLayersMocking(apiClientInstance.apiSauceInstance.axiosInstance);
enableMocking(true);

export const apiClient = apiClientInstance;
// initialize boundaries client
ApiClient.init({
  instanceId: 'boundaries',
  notificationService: notificationServiceInstance,
  baseURL: config.boundariesApi,
  disableAuth: true,
  translationService: i18n,
});
export const boundariesClient = ApiClient.getInstance('boundaries');
// initialize reports client
ApiClient.init({
  instanceId: 'reports',
  notificationService: notificationServiceInstance,
  baseURL: config.reportsApi,
  disableAuth: true,
  translationService: i18n,
});

export function apiClientUnauthorizedCallback() {
  if (
    matchPath(history.location.pathname, {
      path: APP_ROUTES.bivariateManager,
      exact: true,
    })
  ) {
    history.push(config.baseUrl);
  }
}

export const reportsClient = ApiClient.getInstance('reports');
