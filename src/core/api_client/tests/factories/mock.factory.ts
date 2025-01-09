import fetchMock from '@fetch-mock/vitest';
import { FallbackStorage } from '~utils/storage';
import { ApiClientError } from '../../apiClientError';
import { TokenFactory } from './token.factory';
import { AuthFactory } from './auth.factory';
import type { AuthConfig } from './auth.factory';
import type { MockApiErrorResponse, MockApiResponseOptions } from '../types';
import type { GeneralApiProblem } from '../../types';

export class MockFactory {
  private static callCount = 0;

  static async setupSuccessfulAuth(
    config: AuthConfig = {},
    token?: string,
  ): Promise<void> {
    const tokenEndpoint = AuthFactory.getTokenEndpoint(config);
    const accessToken = token || (await TokenFactory.createToken());
    const refreshToken = await TokenFactory.createRefreshToken();

    fetchMock.post(tokenEndpoint, (url: string, opts: any) => {
      this.callCount++;
      return {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: {
          access_token: accessToken,
          refresh_token: refreshToken,
        },
      };
    });
  }

  static setupFailedAuth(config: AuthConfig = {}): void {
    const tokenEndpoint = AuthFactory.getTokenEndpoint(config);

    fetchMock.post(tokenEndpoint, {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
      body: {
        error: 'unauthorized',
        message: 'Token expired',
        error_description: 'Token expired',
      },
    });
  }

  static setupLogoutEndpoint(config: AuthConfig = {}): void {
    const logoutEndpoint = AuthFactory.getLogoutEndpoint(config);
    fetchMock.post(logoutEndpoint, (url: string, opts: any) => {
      this.callCount++;
      return {
        status: 204,
      };
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
    fetchMock.post(AuthFactory.getApiUrl(path), (url: string, opts: any) => {
      this.callCount++;
      return {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: response,
      };
    });
  }

  static createLocalStorage(): FallbackStorage {
    return new FallbackStorage();
  }

  static resetMocks(): void {
    this.callCount = 0;
    fetchMock.mockReset();
    fetchMock.mockGlobal();
  }

  static setupApiError(
    path: string,
    error: MockApiErrorResponse,
    method: string = 'POST',
  ): void {
    const statusMap: Partial<Record<GeneralApiProblem['kind'], number>> = {
      unauthorized: 401,
      forbidden: 403,
      'not-found': 404,
      timeout: 408,
      server: 500,
      'bad-request': 400,
      'bad-data': 422,
    };

    fetchMock.once(
      AuthFactory.getApiUrl(path),
      (url: string, opts: any) => {
        this.callCount++;
        return {
          status: statusMap[error.kind] || 500,
          headers: { 'Content-Type': 'application/json' },
          body: {
            error: error.kind,
            message: error.message,
            data: error.data,
          },
        };
      },
      { method: method.toLowerCase() },
    );
  }

  static setupSuccessfulResponse<T>(
    path: string,
    data: T,
    options: MockApiResponseOptions = {},
  ): void {
    const { method = 'POST', headers = {}, once = true } = options;
    const url = path.startsWith('http') ? path : AuthFactory.getApiUrl(path);

    const response = (url: string, opts: any) => {
      this.callCount++;
      return {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        body: data,
      };
    };

    fetchMock.once(url, response, { method });
  }

  static setupNetworkError(path: string, method: string = 'GET'): void {
    fetchMock[method.toLowerCase()](AuthFactory.getApiUrl(path), {
      throws: new Error("Can't connect to server"),
    });
  }

  static setupTimeoutError(path: string, method: string = 'POST'): void {
    fetchMock[method.toLowerCase()](AuthFactory.getApiUrl(path), {
      throws: new Error('Request Timeout'),
    });
  }

  static setupSequentialResponses(
    path: string,
    responses: any[],
    method: string = 'POST',
  ): void {
    // Reset call count for sequential responses
    this.callCount = 0;

    responses.forEach((response) => {
      if (response instanceof Error) {
        fetchMock.once(
          AuthFactory.getApiUrl(path),
          (url: string, opts: any) => {
            this.callCount++;
            return { throws: response };
          },
          { method },
        );
      } else {
        fetchMock.once(
          AuthFactory.getApiUrl(path),
          (url: string, opts: any) => {
            this.callCount++;
            return {
              status: response.status || 200,
              headers: {
                'Content-Type': 'application/json',
                ...response.headers,
              },
              body: response.body,
            };
          },
          { method },
        );
      }
    });
  }

  static getCallCount(): number {
    return this.callCount;
  }
}
