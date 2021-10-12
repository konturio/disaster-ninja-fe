import config from './app_config/runtime';
import { NotificationService } from './notifications';
import { TranslationService } from './localization';
import { ApiClient } from './api_client';
import { autoRefreshService } from './auto_refresh';

ApiClient.init({
  notificationService: NotificationService.init(),
  baseURL: `/api/${config.apiVersion}`,
  loginApiPath: `/api/${config.apiVersion}/login`,
  translationService: TranslationService,
});

autoRefreshService.start(60 /* refresh every sec */);

export const apiClient = ApiClient.getInstance();
