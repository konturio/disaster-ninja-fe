import { jwtDecode } from 'jwt-decode';
import wretch from 'wretch';
import FormUrlAddon from 'wretch/addons/formUrl';
import { ApiClientError } from '~core/api_client/apiClientError';
import { createApiError } from '~core/api_client/errors';
import { autoParseBody } from '~core/api_client/utils';
import { replaceUrlWithProxy } from '~utils/axios/replaceUrlWithProxy';
import { localStorage } from '~utils/storage';

export const LOCALSTORAGE_AUTH_KEY = 'auth_token';
export const TIME_TO_REFRESH_MS = 1000 * 60 * 3;

interface TokenPayload {
  exp: number;
  iat: number;
}

interface TokenState {
  token: string;
  refreshToken: string;
  expiresAt: Date;
  refreshExpiresAt: Date;
}

export class OidcSimpleClient {
  private issuerUri!: string;
  private clientId!: string;
  private tokenEndpoint!: string;
  private endSessionEndpoint!: string;
  private token = '';
  private refreshToken = '';
  private tokenExpirationDate: Date | undefined;
  private refreshTokenExpirationDate: Date | undefined;
  private tokenRefreshFlowPromise: Promise<boolean> | undefined;

  timeToRefresh: number = TIME_TO_REFRESH_MS;
  isUserLoggedIn = false;

  constructor(
    private readonly storage: WindowLocalStorage['localStorage'] = localStorage,
  ) {}

  public async init(issuerUri: string, clientId: string) {
    this.issuerUri = issuerUri;
    this.clientId = clientId;

    // endpoints, can be found in ${this.issuerUri}/.well-known/openid-configuration
    this.tokenEndpoint = `${this.issuerUri}/protocol/openid-connect/token`;

    // end_session_endpoint /protocol/openid-connect/logout
    this.endSessionEndpoint = `${this.issuerUri}/protocol/openid-connect/logout`;

    if (import.meta.env?.DEV) {
      this.tokenEndpoint = replaceUrlWithProxy(this.tokenEndpoint);
    }

    if (this.checkLocalAuthToken()) {
      this.isUserLoggedIn = true;
      // It's required to refresh auth tokens to get the fresh roles data from keycloak
      await this.refreshAuthToken();
    }
  }

  /**
   * Authentication
   * @throws {ApiClientError}
   */
  private sanitizeToken(token: string): string {
    // Reject tokens with potential XSS payloads
    if (
      token.includes('<') ||
      token.includes('>') ||
      token.includes('javascript:') ||
      token.includes('data:') ||
      token.includes('\\u') ||
      /[<>]|javascript:|data:|\\u|on\w+=/i.test(token)
    ) {
      throw new ApiClientError('Invalid token format: potential XSS', {
        kind: 'bad-data',
      });
    }

    // Validate JWT format: header.payload.signature
    if (!/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/.test(token)) {
      throw new ApiClientError('Invalid token format: not a valid JWT', {
        kind: 'bad-data',
      });
    }

    return token;
  }

  private validateAndParseToken(token: string): [string, ReturnType<typeof parseToken>] {
    // Sanitize token
    const sanitizedToken = this.sanitizeToken(token);

    // Parse and validate token contents
    const decodedToken = parseToken(sanitizedToken);

    return [sanitizedToken, decodedToken];
  }

  private validateTokenState(state: Partial<TokenState>): boolean {
    const now = Date.now();
    return !!(
      state.token &&
      state.refreshToken &&
      state.expiresAt &&
      state.refreshExpiresAt &&
      state.expiresAt.getTime() > now &&
      state.refreshExpiresAt.getTime() > now
    );
  }

  private async updateTokenState(newState: TokenState): Promise<void> {
    try {
      await this.storage.setItem(
        LOCALSTORAGE_AUTH_KEY,
        JSON.stringify({
          token: newState.token,
          refreshToken: newState.refreshToken,
          expiresAt: newState.expiresAt.toISOString(),
          refreshExpiresAt: newState.refreshExpiresAt.toISOString(),
        }),
      );

      this.token = newState.token;
      this.refreshToken = newState.refreshToken;
      this.tokenExpirationDate = newState.expiresAt;
      this.refreshTokenExpirationDate = newState.refreshExpiresAt;
      this.isUserLoggedIn = true;
    } catch (e) {
      this.resetAuth();
      throw new ApiClientError('Failed to update token state', {
        kind: 'bad-data',
      });
    }
  }

  private shouldRefreshToken(): 'must' | 'should' | false {
    if (!this.tokenExpirationDate) return 'must';

    const now = Date.now();
    const timeToExpiry = this.tokenExpirationDate.getTime() - now;

    if (timeToExpiry <= 0) return 'must';
    if (timeToExpiry < this.timeToRefresh) return 'should';
    return false;
  }

  private async _tokenRefreshFlow() {
    const refreshNeeded = this.shouldRefreshToken();

    if (!refreshNeeded) return true;

    try {
      if (refreshNeeded === 'must') {
        await this.refreshAuthToken();
        return true;
      }

      // For 'should' case, try refresh but don't fail if current token still valid
      try {
        await this.refreshAuthToken();
      } catch (error) {
        const now = Date.now();
        if (this.tokenExpirationDate && this.tokenExpirationDate.getTime() > now) {
          console.warn('Preemptive token refresh failed, using existing token:', error);
          return true;
        }
        throw error;
      }
      return true;
    } catch (error) {
      this.resetAuth();
      if (error instanceof ApiClientError) {
        throw error;
      }
      throw new ApiClientError('Token refresh failed', {
        kind: 'unauthorized',
        data: 'Token refresh failed',
      });
    }
  }

  async getAccessToken() {
    try {
      if (!this.tokenRefreshFlowPromise) {
        this.tokenRefreshFlowPromise = this._tokenRefreshFlow();
      }
      await this.tokenRefreshFlowPromise;

      if (
        this.token &&
        this.validateTokenState({
          token: this.token,
          refreshToken: this.refreshToken,
          expiresAt: this.tokenExpirationDate ?? new Date(0),
          refreshExpiresAt: this.refreshTokenExpirationDate ?? new Date(0),
        })
      ) {
        return this.token;
      }

      throw new ApiClientError('No valid token available', {
        kind: 'unauthorized',
        data: 'Token validation failed',
      });
    } catch (error) {
      this.tokenRefreshFlowPromise = undefined;
      throw error;
    } finally {
      this.tokenRefreshFlowPromise = undefined;
    }
  }

  checkLocalAuthToken(): boolean {
    try {
      // First check in-memory tokens
      if (this.token && this.refreshToken) {
        const memoryTokenState: TokenState = {
          token: this.token,
          refreshToken: this.refreshToken,
          expiresAt: this.tokenExpirationDate || new Date(0),
          refreshExpiresAt: this.refreshTokenExpirationDate || new Date(0),
        };

        if (this.validateTokenState(memoryTokenState)) {
          this.isUserLoggedIn = true;
          return true;
        }
      }

      // Then check storage
      const storedTokensJson = this.storage.getItem(LOCALSTORAGE_AUTH_KEY);
      if (!storedTokensJson) {
        this.resetAuth();
        return false;
      }

      const stored = JSON.parse(storedTokensJson);
      if (!stored.token || !stored.refreshToken || !stored.expiresAt) {
        this.resetAuth();
        return false;
      }

      try {
        const [sanitizedToken, decodedToken] = this.validateAndParseToken(stored.token);
        const [sanitizedRefreshToken, decodedRefreshToken] = this.validateAndParseToken(
          stored.refreshToken,
        );

        const tokenState: TokenState = {
          token: sanitizedToken,
          refreshToken: sanitizedRefreshToken,
          expiresAt: new Date(stored.expiresAt),
          refreshExpiresAt: decodedRefreshToken.expiringDate || new Date(0),
        };

        if (!this.validateTokenState(tokenState)) {
          throw new Error('Invalid token state');
        }

        this.timeToRefresh = Math.min(
          Math.trunc((decodedToken.tokenLifetime * 1000) / 5),
          TIME_TO_REFRESH_MS,
        );

        // Update instance state
        this.token = tokenState.token;
        this.refreshToken = tokenState.refreshToken;
        this.tokenExpirationDate = tokenState.expiresAt;
        this.refreshTokenExpirationDate = tokenState.refreshExpiresAt;
        this.isUserLoggedIn = true;
        return true;
      } catch (e) {
        this.resetAuth();
        return false;
      }
    } catch (e) {
      this.resetAuth();
      return false;
    }
  }

  async logout(doReload = true) {
    try {
      await this.endSession();
    } finally {
      if (doReload) {
        location.reload();
      }
    }
  }

  async endSession() {
    const params = {
      client_id: this.clientId,
      refresh_token: this.refreshToken,
    };
    this.resetAuth();
    try {
      await wretch(this.endSessionEndpoint)
        .addon(FormUrlAddon)
        .formUrl(params)
        .post()
        .res();
    } catch (e) {
      // typically response is 204, but if endpoint fails, ignore it
      console.warn('Logout endpoint failed:', e);
    }
  }

  private resetAuth() {
    this.token = '';
    this.refreshToken = '';
    this.tokenExpirationDate = undefined;
    this.refreshTokenExpirationDate = undefined;
    this.isUserLoggedIn = false;
    this.storage.removeItem(LOCALSTORAGE_AUTH_KEY);
  }

  /**
   * @throws {ApiClientError}
   */
  private async refreshAuthToken(): Promise<boolean> {
    // if refresh token is expired, logout
    if (this.isRefreshTokenExpired()) {
      await this.logout();
      throw new ApiClientError('Refresh token expired', {
        kind: 'unauthorized',
        data: 'Refresh token not found or expired',
      });
    }

    const params = {
      refresh_token: this.refreshToken,
      grant_type: 'refresh_token',
    };

    try {
      return await this.requestTokenOrThrow(this.tokenEndpoint, params);
    } catch (error) {
      await this.logout();
      throw error;
    }
  }

  /**
   * @throws {ApiClientError}
   */
  private async requestTokenOrThrow(
    endpoint: string,
    params: Record<string, string>,
  ): Promise<boolean> {
    try {
      const response = await wretch(endpoint)
        .addon(FormUrlAddon)
        .formUrl({ client_id: this.clientId, ...params })
        .post()
        .unauthorized((_) => {
          throw new ApiClientError('Invalid credentials', {
            kind: 'unauthorized',
            data: 'Invalid credentials',
          });
        })
        .res(autoParseBody);

      if (!response.data?.access_token || !response.data?.refresh_token) {
        throw new ApiClientError('Invalid response from auth server', {
          kind: 'bad-data',
        });
      }

      const [sanitizedToken, decodedToken] = this.validateAndParseToken(
        response.data.access_token,
      );
      const [sanitizedRefreshToken, decodedRefreshToken] = this.validateAndParseToken(
        response.data.refresh_token,
      );

      await this.updateTokenState({
        token: sanitizedToken,
        refreshToken: sanitizedRefreshToken,
        expiresAt: decodedToken.expiringDate || new Date(0),
        refreshExpiresAt: decodedRefreshToken.expiringDate || new Date(0),
      });

      return true;
    } catch (error) {
      if (error instanceof ApiClientError) {
        throw error;
      }
      throw createApiError(error);
    }
  }

  /**
   * Direct username/password authentication
   * Warning: legacy grant type, removed in OAuth 2.1
   * @throws {ApiClientError}
   */
  public async login(username: string, password: string): Promise<boolean> {
    const params = {
      username: username,
      password: password,
      client_id: this.clientId,
      grant_type: 'password',
    };
    return await this.requestTokenOrThrow(this.tokenEndpoint, params);
  }

  /**
   * @returns true or error message
   */
  public async authenticate(user: string, password: string) {
    try {
      const loginOk = await this.login(user, password);
      if (loginOk) {
        // reload to init with authenticated config and profile
        location.reload();
      }
      return true;
    } catch (e: unknown) {
      return (e as { message?: string })?.message || 'Login error';
    }
  }

  isRefreshTokenExpired() {
    return (
      !this.refreshTokenExpirationDate || this.refreshTokenExpirationDate < new Date()
    );
  }
}

export function parseToken(token: string) {
  try {
    const decodedToken = jwtDecode<TokenPayload>(token);
    const expiringDate = decodedToken.exp
      ? new Date(decodedToken.exp * 1000)
      : new Date(0);
    const tokenLifetime =
      decodedToken.exp && decodedToken.iat ? decodedToken.exp - decodedToken.iat : 0;
    const expiresIn = +expiringDate - Date.now();
    const isExpired = expiresIn <= 0;

    return { decodedToken, expiringDate, expiresIn, isExpired, tokenLifetime };
  } catch (e) {
    throw new ApiClientError('Invalid token format', { kind: 'bad-data' });
  }
}
