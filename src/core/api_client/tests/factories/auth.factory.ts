import { vi } from 'vitest';
import fetchMock from '@fetch-mock/vitest';
import { AUTH_REQUIREMENT } from '~core/auth/constants';

export interface AuthConfig {
  baseUrl?: string;
  realm?: string;
  clientId?: string;
  username?: string;
  password?: string;
}

interface TokenConfig {
  accessToken?: string;
  refreshToken?: string;
  expiresIn?: number;
  isExpired?: boolean;
}

export class AuthFactory {
  static createConfig(overrides: Partial<AuthConfig> = {}): Required<AuthConfig> {
    return {
      baseUrl: 'https://keycloak01.konturlabs.com',
      realm: 'test',
      clientId: 'kontur_platform',
      username: 'test-user',
      password: 'test-password',
      ...overrides,
    };
  }

  static getTokenEndpoint(config: AuthConfig = {}): string {
    const { baseUrl, realm } = this.createConfig(config);
    return `${baseUrl}/realms/${realm}/protocol/openid-connect/token`;
  }

  static getLogoutEndpoint(config: AuthConfig = {}): string {
    const { baseUrl, realm } = this.createConfig(config);
    return `${baseUrl}/realms/${realm}/protocol/openid-connect/logout`;
  }

  static getApiUrl(path: string = ''): string {
    return `http://localhost:8080/api${path}`;
  }

  static createToken(config: TokenConfig = {}) {
    return {
      access_token: config.accessToken || 'valid-token',
      refresh_token: config.refreshToken || 'refresh-token',
      expires_in: config.isExpired ? -3600 : config.expiresIn || 3600,
    };
  }

  static mockTokenSuccess(tokenEndpoint: string, token = this.createToken()) {
    fetchMock.post(tokenEndpoint, {
      status: 200,
      body: token,
    });
  }

  static mockTokenError(tokenEndpoint: string, error = 'invalid_grant') {
    fetchMock.post(tokenEndpoint, {
      status: 401,
      body: { error },
    });
  }

  static mockLogout(logoutEndpoint: string) {
    fetchMock.post(logoutEndpoint, {
      status: 200,
      body: {},
    });
  }

  static setupAuthClient(client: any, config: TokenConfig = {}) {
    const token = this.createToken(config);

    if (config.isExpired) {
      vi.spyOn(client, 'shouldRefreshToken').mockReturnValue(true);
      vi.spyOn(client, 'isRefreshTokenExpired').mockReturnValue(false);
    }

    return {
      token,
      setToken: async () => {
        await client.updateTokenState({
          token: token.access_token,
          refreshToken: token.refresh_token,
          expiresAt: new Date(Date.now() + token.expires_in * 1000),
          refreshExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
        });
      },
      mockPreemptiveRefresh: () => {
        vi.spyOn(client, 'shouldRefreshToken').mockReturnValue(true);
        vi.spyOn(client, 'isRefreshTokenExpired').mockReturnValue(false);
      },
    };
  }
}
