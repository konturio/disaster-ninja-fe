import { ApiClient } from './api_client';
import app_config from './app_config';
import config from './app_config';
import { userStateAtom } from './auth';
import { i18n } from './localization';
import { notificationServiceInstance } from './notificationServiceInstance';
import { currentUserAtom } from './shared_state';

// initialize main api client
ApiClient.init({
  notificationService: notificationServiceInstance,
  baseURL: config.apiGateway,
  loginApiPath: `${config.keycloakUrl}/auth/realms/${config.keycloakRealm}/protocol/openid-connect/token`,
  refreshTokenApiPath: `${config.keycloakUrl}/auth/realms/${config.keycloakRealm}/protocol/openid-connect/token`,
  translationService: i18n,
  unauthorizedCallback(apiClient) {
    // TODO refactor: same pice of logic exists in AuthClient.logout()
    apiClient.logout();
    currentUserAtom.setUser.dispatch();
    userStateAtom.logout.dispatch();

    if (window['Intercom']) {
      app_config.intercom.name = window.konturAppConfig.INTERCOM_DEFAULT_NAME;
      app_config.intercom['email'] = null;
      window['Intercom']('update', {
        name: app_config.intercom.name,
        email: app_config.intercom['email'],
      });
    }
  },
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
