import fetchMock from '@fetch-mock/vitest';
import { FallbackStorage } from '~utils/storage';
import { ApiClientError } from '../../apiClientError';
import { TokenFactory } from './token.factory';
import { AuthFactory } from './auth.factory';
import type { AuthConfig } from './auth.factory';
import type { ApiErrorResponse, ApiResponseOptions } from '../types';
import type { GeneralApiProblem } from '../../types';

export class MockFactory {
  static async setupSuccessfulAuth(
    config: AuthConfig = {},
    token?: string,
  ): Promise<void> {
    const tokenEndpoint = AuthFactory.getTokenEndpoint(config);
    const accessToken = token || (await TokenFactory.createToken());
    const refreshToken = await TokenFactory.createRefreshToken();

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

  static createLocalStorage(): FallbackStorage {
    return new FallbackStorage();
  }

  static resetMocks(): void {
    fetchMock.mockReset();
    fetchMock.mockGlobal();
  }

  static setupApiError(path: string, error: ApiErrorResponse): void {
    const statusMap: Partial<Record<GeneralApiProblem['kind'], number>> = {
      unauthorized: 401,
      forbidden: 403,
      'not-found': 404,
      timeout: 408,
      'cannot-connect': 503,
      server: 500,
      'client-unknown': 400,
      'bad-data': 422,
    };

    fetchMock.post(AuthFactory.getApiUrl(path), {
      status: statusMap[error.kind] || 500,
      headers: { 'Content-Type': 'application/json' },
      body: {
        error: error.kind,
        message: error.message,
        data: error.data,
      },
    });
  }

  static setupSuccessfulResponse<T>(
    path: string,
    data: T,
    options: ApiResponseOptions = {},
  ): void {
    const { method = 'POST', headers = {}, once = false } = options;

    if (once) {
      fetchMock.once(
        AuthFactory.getApiUrl(path),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            ...headers,
          },
          body: data,
        },
        { method },
      );
    } else {
      fetchMock.post(AuthFactory.getApiUrl(path), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        body: data,
      });
    }
  }

  static setupNetworkError(path: string): void {
    fetchMock.post(AuthFactory.getApiUrl(path), {
      throws: new ApiClientError("Can't connect to server", {
        kind: 'cannot-connect',
        temporary: true,
      }),
    });
  }

  static setupTimeoutError(path: string): void {
    fetchMock.post(AuthFactory.getApiUrl(path), {
      throws: new ApiClientError('Request Timeout', {
        kind: 'timeout',
        temporary: true,
      }),
    });
  }
}
