import fetchMock from '@fetch-mock/vitest';
import { LocalStorageMock } from '../utils/localStorage.mock';
import { TokenFactory } from './token.factory';
import { AuthFactory } from './auth.factory';
import type { AuthConfig } from './auth.factory';

export class MockFactory {
  static setupSuccessfulAuth(config: AuthConfig = {}, token?: string): void {
    const tokenEndpoint = AuthFactory.getTokenEndpoint(config);
    const accessToken = token || TokenFactory.createToken();
    const refreshToken = TokenFactory.createRefreshToken();

    fetchMock.postOnce(tokenEndpoint, {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      body: {
        access_token: accessToken,
        refresh_token: refreshToken,
      },
    });
  }

  static setupFailedAuth(config: AuthConfig = {}): void {
    const tokenEndpoint = AuthFactory.getTokenEndpoint(config);

    fetchMock.post(tokenEndpoint, {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
      body: {
        error: 'invalid_grant',
        error_description: 'Invalid username or password',
      },
    });
  }

  static setupApiEndpoint(path: string, response: any = {}): void {
    fetchMock.post(AuthFactory.getApiUrl(path), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      body: response,
    });
  }

  static createLocalStorage(): LocalStorageMock {
    return new LocalStorageMock();
  }

  static resetMocks(): void {
    fetchMock.mockReset();
    fetchMock.mockGlobal();
  }
}
