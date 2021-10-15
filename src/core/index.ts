import config from './app_config';
import { NotificationService } from './notifications';
import { TranslationService } from './localization';
import { ApiClient } from './api_client';
import { autoRefreshService } from './auto_refresh';

NotificationService.init();
export const notificationService = NotificationService.getInstance();

ApiClient.init({
  notificationService: notificationService,
  baseURL: config.apiGateway,
  loginApiPath: config.loginApiPath,
  translationService: TranslationService,
});

autoRefreshService.start(config.refreshIntervalSec);

export const apiClient = ApiClient.getInstance();
export const translationService = TranslationService;
export { autoRefreshService } from './auto_refresh';
export * as sharedState from './shared_state';
