import config from './app_config';
import { NotificationService } from './notifications';
import { TranslationService } from './localization';
import { ApiClient } from './api_client';
import { autoRefreshService } from './auto_refresh';
import { AuthClient } from '~core/auth';

NotificationService.init();
export const notificationService = NotificationService.getInstance();

// initialize main api client
ApiClient.init({
  notificationService: notificationService,
  baseURL: config.apiGateway,
  loginApiPath: config.loginApiPath,
  translationService: TranslationService,
});
export const apiClient = ApiClient.getInstance();

// initialize boundaries client
ApiClient.init({
  instanceId: 'boundaries',
  notificationService: notificationService,
  baseURL: config.boundariesApi,
  disableAuth: true,
  translationService: TranslationService,
});
export const boundariesClient = ApiClient.getInstance('boundaries');

// initialize graphQl client
ApiClient.init({
  instanceId: 'graphql',
  notificationService: notificationService,
  baseURL: config.graphqlApi,
  disableAuth: true,
  translationService: TranslationService,
});
export const graphQlClient = ApiClient.getInstance('graphql');

// initialize reports client
ApiClient.init({
  instanceId: 'reports',
  notificationService: notificationService,
  baseURL: config.reportsApi,
  disableAuth: true,
  translationService: TranslationService,
});
export const reportsClient = ApiClient.getInstance('reports');

// initialize Keycloak client
ApiClient.init({
  instanceId: 'keycloak',
  notificationService: notificationService,
  baseURL: config.keycloakUrl,
  disableAuth: true,
  translationService: TranslationService,
});

// init authentication
AuthClient.init({ apiClient: ApiClient.getInstance('keycloak') });
export const authClient = AuthClient.getInstance();

autoRefreshService.start(config.refreshIntervalSec);

export const translationService = TranslationService;
export { autoRefreshService } from './auto_refresh';
export * as sharedState from './shared_state';
