import wretch from 'wretch';
import QueryStringAddon from 'wretch/addons/queryString';
import FormUrlAddon from 'wretch/addons/formUrl';
import { jwtDecode } from 'jwt-decode';
import { ApiClientError } from '~core/api_client/apiClientError';
import { createApiError } from '~core/api_client/errors';
import { replaceUrlWithProxy } from '~utils/axios/replaceUrlWithProxy';
import { KONTUR_DEBUG } from '~utils/debug';
import { localStorage } from '~utils/storage';
import { autoParseBody } from '~core/api_client/utils';
import type { ApiResponse, KeycloakAuthResponse } from '~core/api_client/types';

export const LOCALSTORAGE_AUTH_KEY = 'auth_token';
const TIME_TO_REFRESH_MS = 1000 * 60 * 3;

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
  private storeTokens(token: string, refreshToken: string): boolean {
    let errorMessage = '';
    try {
      const decodedToken = parseToken(token);
      const decodedRefreshToken = parseToken(refreshToken);
      if (!decodedToken.isExpired) {
        this.setAuth(
          token,
          refreshToken,
          decodedToken.expiringDate,
          decodedRefreshToken.expiringDate,
        );
        this.storage.setItem(
          LOCALSTORAGE_AUTH_KEY,
          JSON.stringify({ token, refreshToken }),
        );
        return true;
      } else {
        errorMessage = 'Token is expired right after receiving, clock is out of sync';
      }
    } catch (e) {
      errorMessage = e?.['message'];
    }
    throw new ApiClientError(errorMessage || 'Token error', { kind: 'bad-data' });
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
        const { token, refreshToken } = JSON.parse(storedTokensJson);
        if (token && refreshToken) {
          const decodedToken = parseToken(token);
          // ensure timeToRefresh is shorter than tokenLifetime
          this.timeToRefresh = Math.min(
            Math.trunc((decodedToken.tokenLifetime * 1000) / 5),
            TIME_TO_REFRESH_MS,
          );
          const decodedRefreshToken = parseToken(refreshToken);
          this.setAuth(
            token,
            refreshToken,
            decodedToken.expiringDate,
            decodedRefreshToken.expiringDate,
          );
          return true;
        }
      }
    } catch (e) {
      console.debug('checkLocalAuthToken:', e);
    }
    this.resetAuth();
    return false;
  }

  private resetAuth() {
    this.token = '';
    this.refreshToken = '';
    this.tokenExpirationDate = undefined;
    this.refreshTokenExpirationDate = undefined;
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
    const tokenCheck = await this.tokenRefreshFlowPromise;
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
  private async requestTokenOrThrow(url: string, params: object): Promise<boolean> {
    try {
      const response = (await wretch(url)
        .addon(FormUrlAddon)
        .formUrl(params)
        .errorType('json')
        .post()
        .res(autoParseBody)) as ApiResponse<KeycloakAuthResponse>;
      if (response?.data?.access_token) {
        return this.storeTokens(response.data.access_token, response.data.refresh_token);
      }
      throw new ApiClientError('Token error', { kind: 'bad-data' });
    } catch (err) {
      // unable to login or refresh token
      throw createApiError(err);
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
    } catch (e: any) {
      return e?.message || 'Login error';
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
        .errorType('json')
        .post()
        .res();
    } catch (e) {
      // typically response is 204, but if endpoint fails, ignore it
    }
  }

  logout(doReload = true) {
    this.endSession().then((_) => {
      // reload to init with public config and profile
      doReload && location.reload();
    });
  }
}

function parseToken(token: string) {
  const now = Date.now();
  const decodedToken = jwtDecode(token);
  if (decodedToken.exp && decodedToken.iat) {
    const expiringDate = new Date(decodedToken.exp * 1000);
    const tokenLifetime = decodedToken.exp - decodedToken.iat;
    const expiresIn = +expiringDate - now;
    const isExpired = 0 >= expiresIn;

    return { decodedToken, expiringDate, expiresIn, isExpired, tokenLifetime };
  }
  // invalid token?
  throw new Error('Invalid token. Missing exp, iat in payload');
}
