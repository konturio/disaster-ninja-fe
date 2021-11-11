import config from './app_config';
import { NotificationService } from './notifications';
import { TranslationService } from './localization';
import { ApiClient } from './api_client';
import { autoRefreshService } from './auto_refresh';

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

// initialize reports client
ApiClient.init({
  instanceId: 'reports',
  notificationService: notificationService,
  baseURL: config.reportsApi,
  disableAuth: true,
  translationService: TranslationService,
});
export const reportsClient = ApiClient.getInstance('reports');

autoRefreshService.start(config.refreshIntervalSec);

export const translationService = TranslationService;
export { autoRefreshService } from './auto_refresh';
export * as sharedState from './shared_state';
