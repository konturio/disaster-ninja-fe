import { appConfig } from '~core/app_config';
import { ApiClient } from './api_client';
import { notificationServiceInstance } from './notificationServiceInstance';

// initialize main api client
ApiClient.init({
  notificationService: notificationServiceInstance,
  baseURL: appConfig.apiGateway,
  loginApiPath: `${appConfig.keycloakUrl}/auth/realms/${appConfig.keycloakRealm}/protocol/openid-connect/token`,
  refreshTokenApiPath: `${appConfig.keycloakUrl}/auth/realms/${appConfig.keycloakRealm}/protocol/openid-connect/token`,
  keycloakClientId: appConfig.keycloakClientId,
  unauthorizedCallback(apiClient) {
    // TODO: implement for this case special login flow without reload
    apiClient.expiredTokenCallback?.();
  },
});
export const apiClient = ApiClient.getInstance();

// initialize reports client
ApiClient.init({
  instanceId: 'reports',
  notificationService: notificationServiceInstance,
  baseURL: appConfig.reportsApi,
  disableAuth: true,
});

export const reportsClient = ApiClient.getInstance('reports');
