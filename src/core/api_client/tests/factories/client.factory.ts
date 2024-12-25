import { OidcSimpleClient } from '../../../auth/OidcSimpleClient';
import { ApiClient } from '../../apiClient';
import { AuthFactory } from './auth.factory';
import type { AuthConfig } from './auth.factory';
import type { StorageMock } from '~utils/test/mocks/storage.mock';

export interface ClientConfig {
  auth: AuthConfig;
  storage: StorageMock;
}

export class ClientFactory {
  static createAuthClient(config: ClientConfig): OidcSimpleClient {
    const authConfig = AuthFactory.createConfig(config.auth);
    const authClient = new OidcSimpleClient(config.storage);
    authClient.init(
      `${authConfig.baseUrl}/realms/${authConfig.realm}`,
      authConfig.clientId,
    );
    return authClient;
  }

  static createApiClient(authClient: OidcSimpleClient): ApiClient {
    const apiClient = new ApiClient({});
    apiClient.init({ baseUrl: AuthFactory.getApiUrl() });
    apiClient.authService = authClient;
    return apiClient;
  }
}
