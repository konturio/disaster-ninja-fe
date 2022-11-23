import { ApiClient } from './apiClient';
import type { AppConfigParsedI, I18n, LocalizationService, NotificationService } from '..';

export class Api {
  public apiClient: ApiClient;
  public boundariesClient: ApiClient;
  public reportsClient: ApiClient;

  constructor({
    i18n,
    config,
    notifications,
  }: {
    i18n: I18n;
    config: AppConfigParsedI;
    notifications: NotificationService;
  }) {
    // initialize main api client
    ApiClient.init({
      notificationService: notifications,
      baseURL: config.apiGateway,
      loginApiPath: `${config.keycloakUrl}/auth/realms/${config.keycloakRealm}/protocol/openid-connect/token`,
      refreshTokenApiPath: `${config.keycloakUrl}/auth/realms/${config.keycloakRealm}/protocol/openid-connect/token`,
      translationService: i18n,
    });
    this.apiClient = ApiClient.getInstance();

    // initialize boundaries client
    ApiClient.init({
      instanceId: 'boundaries',
      notificationService: notifications,
      baseURL: config.boundariesApi,
      disableAuth: true,
      translationService: i18n,
    });
    this.boundariesClient = ApiClient.getInstance('boundaries');

    // initialize reports client
    ApiClient.init({
      instanceId: 'reports',
      notificationService: notifications,
      baseURL: config.reportsApi,
      disableAuth: true,
      translationService: i18n,
    });
    this.reportsClient = ApiClient.getInstance('reports');

  }
}
