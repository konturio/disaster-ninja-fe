import { NotificationService } from './notifications';
import { TranslationService } from './localization';
import { ApiClient } from './api_client/ApiClient';
import config from './app_config/runtime';

export const boot = () => {
  ApiClient.init({
    notificationService: NotificationService.init(),
    baseURL: `/api/${config.apiVersion}`,
    loginApiPath: `/api/${config.apiVersion}/login`,
    translationService: TranslationService,
  });
};
