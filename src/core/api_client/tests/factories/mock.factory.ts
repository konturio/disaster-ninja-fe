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

  static setupLogoutEndpoint(config: AuthConfig = {}): void {
    const { baseUrl, realm } = AuthFactory.createConfig(config);
    const logoutEndpoint = `${baseUrl}/realms/${realm}/protocol/openid-connect/logout`;
    fetchMock.post(logoutEndpoint, {
      status: 204,
    });
  }

  static setupOidcConfiguration(config: AuthConfig = {}): void {
    const { baseUrl, realm } = AuthFactory.createConfig(config);
    const wellKnownEndpoint = `${baseUrl}/realms/${realm}/.well-known/openid-configuration`;

    fetchMock.get(wellKnownEndpoint, {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      body: {
        issuer: `${baseUrl}/realms/${realm}`,
        authorization_endpoint: `${baseUrl}/realms/${realm}/protocol/openid-connect/auth`,
        token_endpoint: `${baseUrl}/realms/${realm}/protocol/openid-connect/token`,
        introspection_endpoint: `${baseUrl}/realms/${realm}/protocol/openid-connect/token/introspect`,
        userinfo_endpoint: `${baseUrl}/realms/${realm}/protocol/openid-connect/userinfo`,
        end_session_endpoint: `${baseUrl}/realms/${realm}/protocol/openid-connect/logout`,
        frontchannel_logout_session_supported: true,
        frontchannel_logout_supported: true,
        jwks_uri: `${baseUrl}/realms/${realm}/protocol/openid-connect/certs`,
        check_session_iframe: `${baseUrl}/realms/${realm}/protocol/openid-connect/login-status-iframe.html`,
        grant_types_supported: [
          'authorization_code',
          'implicit',
          'refresh_token',
          'password',
          'client_credentials',
          'urn:openid:params:grant-type:ciba',
          'urn:ietf:params:oauth:grant-type:device_code',
        ],
        acr_values_supported: ['0', '1'],
        response_types_supported: [
          'code',
          'none',
          'id_token',
          'token',
          'id_token token',
          'code id_token',
          'code token',
          'code id_token token',
        ],
        subject_types_supported: ['public', 'pairwise'],
        id_token_signing_alg_values_supported: [
          'PS384',
          'ES384',
          'RS384',
          'HS256',
          'HS512',
          'ES256',
          'RS256',
          'HS384',
          'ES512',
          'PS256',
          'PS512',
          'RS512',
        ],
        userinfo_signing_alg_values_supported: [
          'PS384',
          'ES384',
          'RS384',
          'HS256',
          'HS512',
          'ES256',
          'RS256',
          'HS384',
          'ES512',
          'PS256',
          'PS512',
          'RS512',
          'none',
        ],
        token_endpoint_auth_methods_supported: [
          'private_key_jwt',
          'client_secret_basic',
          'client_secret_post',
          'tls_client_auth',
          'client_secret_jwt',
        ],
        claims_supported: [
          'aud',
          'sub',
          'iss',
          'auth_time',
          'name',
          'given_name',
          'family_name',
          'preferred_username',
          'email',
          'acr',
        ],
        scopes_supported: [
          'openid',
          'roles',
          'phone',
          'offline_access',
          'web-origins',
          'microprofile-jwt',
          'email',
          'address',
          'profile',
          'acr',
        ],
        code_challenge_methods_supported: ['plain', 'S256'],
        tls_client_certificate_bound_access_tokens: true,
        backchannel_logout_supported: true,
        backchannel_logout_session_supported: true,
        authorization_response_iss_parameter_supported: true,
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
      fetchMock[method.toLowerCase()](AuthFactory.getApiUrl(path), {
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
