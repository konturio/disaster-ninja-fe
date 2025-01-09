import { jwtDecode } from 'jwt-decode';
import wretch from 'wretch';
import FormUrlAddon from 'wretch/addons/formUrl';
import { ApiClientError } from '~core/api_client/apiClientError';
import { createApiError } from '~core/api_client/errors';
import { autoParseBody } from '~core/api_client/utils';
import { replaceUrlWithProxy } from '~utils/axios/replaceUrlWithProxy';
import { localStorage } from '~utils/storage';
import {
  AUTH_EVENT_TYPE,
  AUTH_REQUIREMENT,
  LOCALSTORAGE_AUTH_KEY,
  SESSION_STATE,
  TIME_TO_REFRESH_MS,
  type AuthEventType,
  type AuthRequirement,
  type SessionState,
} from './constants';

// Re-export only what's needed by external modules
export type { AuthEventType, AuthRequirement, SessionState };

export interface AuthEvent {
  type: AuthEventType;
  reason?: string;
  error?: Error;
  sessionState?: SessionState;
}

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

export interface GetAccessTokenOptions {
  requirement?: AuthRequirement;
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
  private sessionState: SessionState = SESSION_STATE.NO_SESSION;
  private lastError: Error | null = null;

  timeToRefresh: number = TIME_TO_REFRESH_MS;

  get isUserLoggedIn(): boolean {
    return this.sessionState === SESSION_STATE.VALID;
  }

  private setSessionState(state: SessionState, error: Error | null = null) {
    this.sessionState = state;
    this.lastError = error;

    // Emit event for session state change
    const event = new CustomEvent('sessionStateChanged', {
      detail: { state, error },
    });
    window.dispatchEvent(event);
  }

  constructor(
    private readonly storage: WindowLocalStorage['localStorage'] = localStorage,
  ) {
    // Listen for storage events from other tabs
    window.addEventListener('storage', (e) => {
      if (e.key === LOCALSTORAGE_AUTH_KEY) {
        if (!e.newValue) {
          this.resetAuth();
        } else {
          this.checkLocalAuthToken();
        }
      }
    });
  }

  public async init(issuerUri: string, clientId: string) {
    this.issuerUri = issuerUri;
    this.clientId = clientId;

    // endpoints, can be found in ${this.issuerUri}/.well-known/openid-configuration
    this.tokenEndpoint = `${this.issuerUri}/protocol/openid-connect/token`;
    this.endSessionEndpoint = `${this.issuerUri}/protocol/openid-connect/logout`;

    if (import.meta.env?.DEV) {
      this.tokenEndpoint = replaceUrlWithProxy(this.tokenEndpoint);
    }

    // Check local storage for existing auth state
    const hasValidToken = this.checkLocalAuthToken();

    // If we have a valid token, try to refresh it
    if (hasValidToken) {
      try {
        await this.refreshAuthToken();
        this.setSessionState(SESSION_STATE.VALID);
      } catch (error) {
        // If refresh fails during init, just reset auth state
        this.resetAuth();
      }
    }

    // Return auth state so application can handle initial routing
    return {
      isAuthenticated: this.isUserLoggedIn,
      hasExpiredSession: hasValidToken && !this.isUserLoggedIn,
    };
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
      this.setSessionState(SESSION_STATE.VALID);
    } catch (e) {
      this.resetAuth();
      throw new ApiClientError('Failed to update token state', {
        kind: 'bad-data',
      });
    }
  }

  private shouldRefreshToken(): 'must' | 'should' | false {
    if (!this.tokenExpirationDate) return AUTH_REQUIREMENT.MUST;

    const now = Date.now();
    const timeToExpiry = this.tokenExpirationDate.getTime() - now;

    if (timeToExpiry <= 0) return AUTH_REQUIREMENT.MUST;
    if (timeToExpiry < this.timeToRefresh) return AUTH_REQUIREMENT.SHOULD;
    return false;
  }

  private async _tokenRefreshFlow() {
    const refreshNeeded = this.shouldRefreshToken();

    if (!refreshNeeded) return true;

    try {
      if (refreshNeeded === AUTH_REQUIREMENT.MUST) {
        // If refresh token is expired, handle it gracefully
        if (this.isRefreshTokenExpired()) {
          this.resetAuth();
          // Return false to indicate auth is needed, but don't throw
          return false;
        }
        await this.refreshAuthToken();
        return true;
      }

      // For AUTH_REQUIREMENT.SHOULD case, try refresh but don't fail if current token still valid
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
      throw createApiError(error);
    }
  }

  async getAccessToken(options: GetAccessTokenOptions = {}) {
    const requirement = options.requirement || AUTH_REQUIREMENT.MUST;
    try {
      // For endpoints that can work without authentication
      if (!this.isUserLoggedIn) {
        if (requirement === AUTH_REQUIREMENT.MUST) {
          throw new ApiClientError('Authentication required', {
            kind: 'unauthorized',
            data: 'not_authenticated',
          });
        }
        return ''; // For AUTH_REQUIREMENT.SHOULD or 'optional', proceed without token
      }

      if (!this.tokenRefreshFlowPromise) {
        this.tokenRefreshFlowPromise = this._tokenRefreshFlow();
      }
      const refreshResult = await this.tokenRefreshFlowPromise;

      if (!refreshResult) {
        if (requirement === AUTH_REQUIREMENT.MUST) {
          this.setSessionState(SESSION_STATE.EXPIRED);
          throw new ApiClientError('Session expired', {
            kind: 'unauthorized',
            data: 'session_expired',
          });
        }
        return ''; // For AUTH_REQUIREMENT.SHOULD or 'optional', proceed without token
      }

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

      if (requirement === AUTH_REQUIREMENT.MUST) {
        this.setSessionState(SESSION_STATE.ERROR, new Error('Invalid token state'));
        throw new ApiClientError('Invalid token state', {
          kind: 'unauthorized',
          data: 'invalid_token',
        });
      }
      return ''; // For AUTH_REQUIREMENT.SHOULD or 'optional', proceed without token
    } catch (error) {
      this.tokenRefreshFlowPromise = undefined;
      if (error instanceof Error) {
        this.setSessionState(SESSION_STATE.ERROR, error);
      }
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
          this.setSessionState(SESSION_STATE.VALID);
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
        this.setSessionState(SESSION_STATE.VALID);
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
    // If we don't have a refresh token, just reset auth state
    if (!this.refreshToken) {
      this.resetAuth();
      return;
    }

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
    this.setSessionState(SESSION_STATE.NO_SESSION);
    this.storage.removeItem(LOCALSTORAGE_AUTH_KEY);
  }

  /**
   * @throws {ApiClientError}
   */
  private async refreshAuthToken(): Promise<boolean> {
    const params = {
      refresh_token: this.refreshToken,
      grant_type: 'refresh_token',
    };

    try {
      return await this.requestTokenOrThrow(this.tokenEndpoint, params);
    } catch (error) {
      // If we get an invalid_grant error, the refresh token is no longer valid
      if (
        error instanceof ApiClientError &&
        error.problem.kind === 'rejected' &&
        typeof error.problem.data === 'object' &&
        error.problem.data &&
        'error' in error.problem.data &&
        (error.problem.data as { error: string }).error === 'invalid_grant'
      ) {
        this.resetAuth();
      }
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

  /**
   * Check if authentication is required for the current state
   * @returns true if authentication is needed, false if we have valid tokens
   */
  isAuthenticationRequired(): boolean {
    return !this.isUserLoggedIn || this.isRefreshTokenExpired();
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
