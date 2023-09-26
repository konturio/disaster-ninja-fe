import wretch from 'wretch';
import QueryStringAddon from 'wretch/addons/queryString';
import FormUrlAddon from 'wretch/addons/formUrl';
import jwtDecode from 'jwt-decode';
import { replaceUrlWithProxy } from '~utils/axios/replaceUrlWithProxy';
import { KONTUR_DEBUG } from '~utils/debug';
import { localStorage } from '~utils/storage';
import { typedObjectEntries } from 'types/entry';
import { ApiClientError } from './apiClientError';
import { createApiError } from './errors';
import { ApiMethodTypes } from './types';
import type { WretchResponse } from 'wretch';
import type {
  ApiClientConfig,
  ApiResponse,
  ApiMethod,
  CustomRequestConfig,
  JWTData,
  KeycloakAuthResponse,
  RequestParams,
} from './types';

export const LOCALSTORAGE_AUTH_KEY = 'auth_token';

export class ApiClient {
  private listeners = new Map([['error', new Set<(e: ApiClientError) => void>()]]);
  private loginApiPath!: string;
  private refreshTokenApiPath!: string;
  private disableAuth!: boolean;
  private readonly storage: WindowLocalStorage['localStorage'];
  private token = '';
  private refreshToken = '';
  private tokenExpirationDate: Date | undefined;
  private tokenRefreshFlowPromise: Promise<boolean> | undefined;
  private keycloakClientId!: string;
  private baseURL!: string;
  timeToRefresh: number = 1000 * 60 * 3; // Should be less then Access Token Lifespan

  /**
   * The Singleton's constructor should always be private to prevent direct
   * construction calls with the `new` operator.
   */
  constructor({
    storage = localStorage,
    on,
  }: {
    storage?: WindowLocalStorage['localStorage'];
    on?: { error: (c: ApiClientError) => void };
  }) {
    if (on) {
      typedObjectEntries(on).forEach(([event, cb]) => this.on(event, cb));
    }
    this.storage = storage;
  }

  public setup(cfg: ApiClientConfig) {
    if (!cfg.disableAuth) {
      this.disableAuth = false;
      this.loginApiPath = `${cfg.keycloakUrl}/auth/realms/${cfg.keycloakRealm}/protocol/openid-connect/token`;
      this.refreshTokenApiPath = `${cfg.keycloakUrl}/auth/realms/${cfg.keycloakRealm}/protocol/openid-connect/token`;
      this.keycloakClientId = cfg.keycloakClientId;
    } else {
      this.disableAuth = true;
    }

    // Will deleted by terser
    let baseURL = cfg.baseUrl;
    if (import.meta.env?.DEV) {
      baseURL = replaceUrlWithProxy(baseURL ?? '');
      this.loginApiPath = replaceUrlWithProxy(this.loginApiPath);
    }
    this.baseURL = baseURL;
  }

  public on(event: 'error', cb: (c: ApiClientError) => void) {
    this.listeners.get(event)?.add(cb);
    return () => this.listeners.get(event)?.delete(cb);
  }

  /**
   * Authentication
   * @throws {ApiClientError}
   */
  private storeTokens(token: string, refreshToken: string): boolean {
    let errorMessage = '';
    try {
      const decodedToken: JWTData = jwtDecode(token);
      if (KONTUR_DEBUG) {
        console.debug({ decodedToken, now: new Date().getTime() });
      }
      if (decodedToken && decodedToken.exp) {
        const expiringDate = new Date(decodedToken.exp * 1000);
        if (expiringDate > new Date()) {
          this.setAuth(token, refreshToken, expiringDate);
          this.storage.setItem(
            LOCALSTORAGE_AUTH_KEY,
            JSON.stringify({ token, refreshToken }),
          );
          return true;
        } else {
          errorMessage = 'Token is expired right after receiving, clock is out of sync';
        }
      }
    } catch (e) {
      errorMessage = 'Token decode error';
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
          const decodedToken: JWTData = jwtDecode(token);
          const expiringDate = new Date(decodedToken.exp * 1000);
          this.setAuth(token, refreshToken, expiringDate);
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
    this.storage.removeItem(LOCALSTORAGE_AUTH_KEY);
  }

  private setAuth(token: string, refreshToken: string, expiringDate: Date | undefined) {
    this.token = token;
    this.refreshToken = refreshToken;
    this.tokenExpirationDate = expiringDate;
  }

  private async _tokenRefreshFlow() {
    if (!this.tokenExpirationDate) {
      return false;
    }
    const diffTime = this.tokenExpirationDate.getTime() - new Date().getTime();
    if (diffTime < this.timeToRefresh) {
      // token expires soon - in 5 minutes, refresh it
      try {
        await this.refreshAuthToken();
      } catch (error) {
        return false;
      }
    }
    return true;
  }

  /**
   * @throws {ApiClientError}
   */
  private async isTokenOk(): Promise<boolean> {
    if (!this.tokenRefreshFlowPromise) {
      this.tokenRefreshFlowPromise = this._tokenRefreshFlow();
    }
    const tokenCheck = await this.tokenRefreshFlowPromise;
    this.tokenRefreshFlowPromise = undefined;
    return tokenCheck;
  }

  /**
   * @throws {ApiClientError}
   */
  public async login(username: string, password: string): Promise<boolean> {
    const params = {
      username: username,
      password: password,
      client_id: this.keycloakClientId,
      grant_type: 'password',
    };
    return await this.requestTokenOrThrow(this.loginApiPath, params);
  }

  /**
   * @throws {ApiClientError}
   */
  private async refreshAuthToken(): Promise<boolean> {
    const params = {
      client_id: this.keycloakClientId,
      refresh_token: this.refreshToken,
      grant_type: 'refresh_token',
    };
    return await this.requestTokenOrThrow(this.refreshTokenApiPath, params);
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
      const error = createApiError(err);
      this._emit('error', error);
      throw error;
    }
  }

  private _emit(type: 'error', payload: ApiClientError) {
    this.listeners.get(type)?.forEach((l) => l(payload));
  }

  async logout() {
    this.resetAuth();
  }

  private async call<T>(
    method: ApiMethod,
    path: string,
    requestParams?: unknown,
    useAuth = !this.disableAuth,
    requestConfig: CustomRequestConfig = {},
  ): Promise<T | null> {
    const RequestsWithBody = ['post', 'put', 'patch'];

    let req = wretch(this.baseURL, { mode: 'cors' }).addon(QueryStringAddon).url(path);

    if (requestConfig.signal) {
      req = req.options({ signal: requestConfig.signal });
    }

    if (requestConfig.headers) {
      req = req.headers(requestConfig.headers);
    }

    if (!this.disableAuth && useAuth && this.token) {
      const tokenOk = await this.isTokenOk();
      if (tokenOk) {
        req = req
          .auth(`Bearer ${this.token}`)
          .catcher(401, async (_, originalRequest) => {
            await this.refreshAuthToken();
            // replay original request with new token
            return originalRequest
              .auth(`Bearer ${this.token}`)
              .fetch()
              .unauthorized((err) => {
                // Redefine unauthorized hook to prevent infinite loops with multiple 401 errors
                throw err;
              })
              .res(autoParseBody);
          });
      }
    }

    if (requestParams) {
      req = RequestsWithBody.includes(method)
        ? req.json(requestParams)
        : req.query(requestParams);
    }

    try {
      const response = await req[method]().res(autoParseBody);
      return response.data as T;
    } catch (err) {
      const apiError = createApiError(err);
      if (apiError.problem.kind === 'canceled') {
        throw apiError;
      }
      if (apiError.problem.kind === 'unauthorized') {
        // TODO: call redirection callback if user not authorized, route to login page
        this.resetAuth();
        this._emit('error', apiError);
      }
      // use custom error messages if defined
      const errorsConfig = requestConfig.errorsConfig;
      if (errorsConfig && errorsConfig.messages) {
        if (typeof errorsConfig.messages !== 'string') {
          if (apiError.status in errorsConfig.messages) {
            apiError.message = errorsConfig.messages[apiError.status];
          }
        } else {
          apiError.message = errorsConfig.messages;
        }
      }

      if (errorsConfig?.hideErrors !== true) {
        this._emit('error', apiError);
      }

      throw apiError;
    }
  }

  // method shortcuts
  public async get<T>(
    path: string,
    requestParams?: RequestParams,
    useAuth = !this.disableAuth,
    requestConfig?: CustomRequestConfig,
  ): Promise<T | null> {
    return this.call<T>(ApiMethodTypes.GET, path, requestParams, useAuth, requestConfig);
  }

  public async post<T>(
    path: string,
    requestParams?: unknown,
    useAuth = !this.disableAuth,
    requestConfig?: CustomRequestConfig,
  ): Promise<T | null> {
    return this.call(ApiMethodTypes.POST, path, requestParams, useAuth, requestConfig);
  }

  public async put<T>(
    path: string,
    requestParams?: RequestParams,
    useAuth = !this.disableAuth,
    requestConfig?: CustomRequestConfig,
  ): Promise<T | null> {
    return this.call(ApiMethodTypes.PUT, path, requestParams, useAuth, requestConfig);
  }

  public async patch<T>(
    path: string,
    requestParams?: RequestParams,
    useAuth = !this.disableAuth,
    requestConfig?: CustomRequestConfig,
  ): Promise<T | null> {
    return this.call(ApiMethodTypes.PATCH, path, requestParams, useAuth, requestConfig);
  }

  public async delete<T>(
    path: string,
    useAuth = !this.disableAuth,
    requestConfig?: CustomRequestConfig,
  ): Promise<T | null> {
    return this.call(ApiMethodTypes.DELETE, path, undefined, useAuth, requestConfig);
  }
}

async function autoParseBody(res: WretchResponse) {
  if (res.status === 204) {
    res.data = null;
    return res;
  }

  if (res.ok) {
    const contentType = res.headers.get('content-type') ?? '';
    if (contentType.includes('application/json')) {
      res.data = await res.json();
    } else {
      res.data = await res.text();
    }
  } else {
    console.debug('autoParseBody', res);
  }

  return res;
}
