import { jwtDecode } from 'jwt-decode';
import wretch from 'wretch';
import FormUrlAddon from 'wretch/addons/formUrl';
import { ApiClientError } from '~core/api_client/apiClientError';
import { createApiError } from '~core/api_client/errors';
import { autoParseBody } from '~core/api_client/utils';
import { replaceUrlWithProxy } from '~utils/axios/replaceUrlWithProxy';
import { localStorage } from '~utils/storage';

export const LOCALSTORAGE_AUTH_KEY = 'auth_token';
const TIME_TO_REFRESH_MS = 1000 * 60 * 3;

interface TokenPayload {
  exp: number;
  iat: number;
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

  timeToRefresh: number = TIME_TO_REFRESH_MS; // Must be less then Access Token Lifespan
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

  private storeTokens(token: string, refreshToken: string): boolean {
    try {
      // Validate both tokens
      const [sanitizedToken, decodedToken] = this.validateAndParseToken(token);
      const [sanitizedRefreshToken, decodedRefreshToken] =
        this.validateAndParseToken(refreshToken);

      if (!decodedToken.isExpired) {
        this.setAuth(
          sanitizedToken,
          sanitizedRefreshToken,
          decodedToken.expiringDate,
          decodedRefreshToken.expiringDate,
        );

        // Store tokens
        this.storage.setItem(
          LOCALSTORAGE_AUTH_KEY,
          JSON.stringify({
            token: sanitizedToken,
            refreshToken: sanitizedRefreshToken,
            expiresAt: decodedToken.expiringDate.toISOString(),
          }),
        );
        return true;
      } else {
        throw new ApiClientError(
          'Token is expired right after receiving, clock is out of sync',
          { kind: 'bad-data' },
        );
      }
    } catch (e) {
      if (e instanceof ApiClientError) {
        throw e;
      }
      throw new ApiClientError(e?.['message'] || 'Token validation failed', {
        kind: 'bad-data',
      });
    }
  }

  /**
   * check and use local token, reset auth if token is absent or invalid
   * @returns true on success
   */
  checkLocalAuthToken(): boolean {
    if (this.token && this.refreshToken) {
      return true;
    }
    try {
      const storedTokensJson = this.storage.getItem(LOCALSTORAGE_AUTH_KEY);
      if (storedTokensJson) {
        const stored = JSON.parse(storedTokensJson);
        if (stored.token && stored.refreshToken) {
          try {
            // Validate both tokens
            const [sanitizedToken, decodedToken] = this.validateAndParseToken(
              stored.token,
            );
            const [sanitizedRefreshToken, decodedRefreshToken] =
              this.validateAndParseToken(stored.refreshToken);

            // Validate expiration
            if (decodedToken.isExpired) {
              throw new Error('Token is expired');
            }

            this.timeToRefresh = Math.min(
              Math.trunc((decodedToken.tokenLifetime * 1000) / 5),
              TIME_TO_REFRESH_MS,
            );

            this.setAuth(
              sanitizedToken,
              sanitizedRefreshToken,
              decodedToken.expiringDate,
              decodedRefreshToken.expiringDate,
            );
            return true;
          } catch (e) {
            this.resetAuth();
            return false;
          }
        }
      }
    } catch (e) {
      // Handle silently - invalid token state should just reset auth
    }
    this.resetAuth();
    return false;
  }

  private resetAuth() {
    // Securely clear tokens from memory
    this.token = '';
    this.refreshToken = '';
    this.tokenExpirationDate = undefined;
    this.refreshTokenExpirationDate = undefined;

    // Clear from storage
    this.storage.removeItem(LOCALSTORAGE_AUTH_KEY);
  }

  private setAuth(
    token: string,
    refreshToken: string,
    expiringDate: Date | undefined,
    expiringRefreshDate?: Date | undefined,
  ) {
    this.token = token;
    this.refreshToken = refreshToken;
    this.tokenExpirationDate = expiringDate;
    this.refreshTokenExpirationDate = expiringRefreshDate;
  }

  private async _tokenRefreshFlow() {
    if (!this.tokenExpirationDate) {
      return false;
    }
    const diffTime = this.tokenExpirationDate.getTime() - Date.now();
    if (diffTime < this.timeToRefresh) {
      // token expires soon, refresh it
      try {
        await this.refreshAuthToken();
      } catch (error) {
        return false;
      }
    }
    return true;
  }

  /**
   * return AT or throw error
   * automatically refreshes expired or expiring soon AT
   * @throws {ApiClientError}
   */
  async getAccessToken() {
    if (!this.tokenRefreshFlowPromise) {
      this.tokenRefreshFlowPromise = this._tokenRefreshFlow();
    }
    await this.tokenRefreshFlowPromise;
    this.tokenRefreshFlowPromise = undefined;
    return this.token;
  }

  isRefreshTokenExpired() {
    return (
      !this.refreshTokenExpirationDate || this.refreshTokenExpirationDate < new Date()
    );
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
      client_id: this.clientId,
      refresh_token: this.refreshToken,
      grant_type: 'refresh_token',
    };

    try {
      return await this.requestTokenOrThrow(this.tokenEndpoint, params);
    } catch (error) {
      // logout on refresh token error
      await this.logout();
      throw error;
    }
  }

  /**
   * @throws {ApiClientError}
   */
  private async requestTokenOrThrow(
    grantType: string,
    params: Record<string, string>,
  ): Promise<boolean> {
    try {
      const response = await wretch(this.tokenEndpoint)
        .addon(FormUrlAddon)
        .formUrl({ grant_type: grantType, client_id: this.clientId, ...params })
        .post()
        .unauthorized((_) => {
          throw new ApiClientError('Invalid username or password', {
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

      try {
        // Validate and store tokens
        const result = this.storeTokens(
          response.data.access_token,
          response.data.refresh_token,
        );
        this.isUserLoggedIn = true;
        return result;
      } catch (e) {
        // Reset auth state on validation failure
        this.resetAuth();
        throw e;
      }
    } catch (e) {
      if (e instanceof ApiClientError) {
        throw e;
      }
      throw createApiError(e);
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

  async endSession() {
    const params = {
      client_id: this.clientId,
      refresh_token: this.refreshToken,
    };
    this.resetAuth();
    try {
      wretch(this.endSessionEndpoint)
        .addon(FormUrlAddon)
        .formUrl(params)
        .post()
        .res()
        .then();
    } catch (e) {
      // typically response is 204, but if endpoint fails, ignore it
    }
  }

  /**
   * reset auth, end session and reload
   * @param doReload
   */
  logout(doReload = true) {
    this.endSession().then((_) => {
      // reload to init with public config and profile
      if (doReload) location.reload();
    });
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
