import { appConfig } from '~core/app_config';
import { ApiClient } from './api_client';
import { i18n } from './localization';
import { notificationServiceInstance } from './notificationServiceInstance';

// initialize main api client
ApiClient.init({
  notificationService: notificationServiceInstance,
  baseURL: appConfig.apiGateway,
  loginApiPath: `${appConfig.keycloakUrl}/auth/realms/${appConfig.keycloakRealm}/protocol/openid-connect/token`,
  refreshTokenApiPath: `${appConfig.keycloakUrl}/auth/realms/${appConfig.keycloakRealm}/protocol/openid-connect/token`,
  translationService: i18n,
  unauthorizedCallback(apiClient) {
    apiClient.logout();
    apiClient.expiredTokenCallback?.();
  },
});
export const apiClient = ApiClient.getInstance();

// initialize boundaries client
ApiClient.init({
  instanceId: 'boundaries',
  notificationService: notificationServiceInstance,
  baseURL: appConfig.boundariesApi,
  disableAuth: true,
  translationService: i18n,
});

export const boundariesClient = ApiClient.getInstance('boundaries');

// initialize reports client
ApiClient.init({
  instanceId: 'reports',
  notificationService: notificationServiceInstance,
  baseURL: appConfig.reportsApi,
  disableAuth: true,
  translationService: i18n,
});

export const reportsClient = ApiClient.getInstance('reports');
