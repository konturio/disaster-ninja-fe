/**
 * @vitest-environment happy-dom
 */
/* eslint-disable import/order */
import fetchMock from '@fetch-mock/vitest';
import type { OidcSimpleClient } from '../../auth/OidcSimpleClient';
import type { ApiClient } from '../apiClient';
import { TokenFactory } from './factories/token.factory';
import { AuthFactory } from './factories/auth.factory';
import { MockFactory } from './factories/mock.factory';
import { ClientFactory } from './factories/client.factory';
import type { FallbackStorage } from '~utils/storage';

export interface TestContext {
  baseUrl: string;
  keycloakRealm: string;
  username: string;
  password: string;
  token: string;
  expiredToken: string;
  refreshToken: string;
  authClient: OidcSimpleClient;
  apiClient: ApiClient;
  localStorageMock: FallbackStorage;
  fetchMock: typeof fetchMock;
  loginFunc: () => Promise<any>;
}

export async function createContext(): Promise<TestContext> {
  // Reset all mocks
  MockFactory.resetMocks();

  // Create configuration and storage
  const config = AuthFactory.createConfig();
  const storage = MockFactory.createLocalStorage();

  // Create tokens
  const [token, expiredToken, refreshToken] = await Promise.all([
    TokenFactory.createToken(),
    TokenFactory.createExpiredToken(),
    TokenFactory.createRefreshToken(),
  ]);

  // Create clients
  const authClient = ClientFactory.createAuthClient({
    auth: config,
    storage,
  });
  const apiClient = ClientFactory.createApiClient(authClient);

  // Setup default mocks
  await MockFactory.setupSuccessfulAuth(config, token);
  MockFactory.setupFailedAuth(config);
  MockFactory.setupLogoutEndpoint(config);
  MockFactory.setupOidcConfiguration(config);

  // Setup default API endpoint
  MockFactory.setupSuccessfulResponse('/test', { data: 'test' }, { method: 'get' });
  MockFactory.setupSuccessfulResponse('/test', { data: 'test' }, { method: 'post' });

  return {
    baseUrl: config.baseUrl,
    keycloakRealm: config.realm,
    username: config.username,
    password: config.password,
    token,
    expiredToken,
    refreshToken,
    authClient,
    apiClient,
    localStorageMock: storage,
    fetchMock,
    loginFunc: () => authClient.login(config.username, config.password),
  };
}
