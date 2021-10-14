import config from './app_config/runtime';
import { NotificationService } from './notifications';
import { TranslationService } from './localization';
import { ApiClient } from './api_client';
import { autoRefreshService } from './auto_refresh';

NotificationService.init();
export const notificationService = NotificationService.getInstance();

ApiClient.init({
  notificationService: notificationService,
  baseURL: `https://test-apps-ninja02.konturlabs.com/active/api`,
  loginApiPath: `/api/${config.apiVersion}/login`,
  translationService: TranslationService,
});

autoRefreshService.start(60 /* refresh every sec */);

export const apiClient = ApiClient.getInstance();
export const translationService = TranslationService;
export { autoRefreshService } from './auto_refresh';
export * as sharedState from './shared_state';
