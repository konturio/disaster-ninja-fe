import { ApiClient } from './api_client';
import config from './app_config';
import { NotificationService } from './notifications';
import { TranslationService } from './localization';
import { autoRefreshService } from './auto_refresh';
import { init as initLogicalLayers } from './logical_layers';
import { AuthClient } from '~core/auth';
import { setupDefaultLayersMocking } from '~utils/axios/setupTemporaryMocking';
import { enableMocking } from '~utils/axios/axiosMockUtils';

NotificationService.init();
initLogicalLayers();
export const notificationService = NotificationService.getInstance();

// initialize main api client
ApiClient.init({
  notificationService: notificationService,
  baseURL: config.apiGateway,
  loginApiPath: `${config.keycloakUrl}/auth/realms/${config.keycloakRealm}/protocol/openid-connect/token`,
  refreshTokenApiPath: `${config.keycloakUrl}/auth/realms/${config.keycloakRealm}/protocol/openid-connect/token`,
  translationService: TranslationService,
});
const apiClientInstance = ApiClient.getInstance();
// @ts-ignore TODO: implement more legal way
setupDefaultLayersMocking(apiClientInstance.apiSauceInstance.axiosInstance);
enableMocking(true);

export const apiClient = apiClientInstance;

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

// init authentication
AuthClient.init({ apiClient });
export const authClient = AuthClient.getInstance();

autoRefreshService.start(config.refreshIntervalSec);

export const translationService = TranslationService;
export { autoRefreshService } from './auto_refresh';
export * as sharedState from './shared_state';
