import config from './app_config';
import { NotificationService } from './notifications';
import { TranslationService } from './localization';
import { ApiClient } from './api_client';
import { autoRefreshService } from './auto_refresh';
import { AuthClient } from '~core/auth/AuthClient';
import { enableMocking } from '~utils/axios/axiosMockUtils';
import { setupTemporaryMocking } from '~utils/axios/setupTemporaryMocking';

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
// todo: Remove mocking once backend service will be fully complete
enableMocking(true);
setupTemporaryMocking(apiClient['apiSauceInstance'].axiosInstance);

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
