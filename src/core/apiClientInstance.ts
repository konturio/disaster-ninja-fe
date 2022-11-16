import { matchPath } from 'react-router';
import history from '~core/history';
import { ApiClient } from './api_client';
import config from './app_config';
import { i18n } from './localization';
import { notificationServiceInstance } from './notificationServiceInstance';

// initialize main api client
ApiClient.init({
  notificationService: notificationServiceInstance,
  baseURL: config.apiGateway,
  loginApiPath: `${config.keycloakUrl}/auth/realms/${config.keycloakRealm}/protocol/openid-connect/token`,
  refreshTokenApiPath: `${config.keycloakUrl}/auth/realms/${config.keycloakRealm}/protocol/openid-connect/token`,
  translationService: i18n,
});
const apiClientInstance = ApiClient.getInstance();

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

export const reportsClient = ApiClient.getInstance('reports');
