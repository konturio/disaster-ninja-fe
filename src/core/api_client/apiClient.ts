import wretch from 'wretch';
import QueryStringAddon from 'wretch/addons/queryString';
import FormUrlAddon from 'wretch/addons/formUrl';
import FormDataAddon from 'wretch/addons/formData';
import jwtDecode from 'jwt-decode';
import { replaceUrlWithProxy } from '~utils/axios/replaceUrlWithProxy';
import { ApiMethodTypes, getGeneralApiProblem } from './types';
import { ApiClientError } from './apiClientError';
import { parseApiError } from './errors';
import type { ApiErrorResponse, ApiResponse } from '~utils/axios/apisauce/apisauce';
import type {
  ApiClientConfig,
  ApiMethod,
  CustomRequestConfig,
  GeneralApiProblem,
  JWTData,
  KeycloakAuthResponse,
  RequestErrorsConfig,
  RequestParams,
  ITranslationService,
  INotificationService,
  LocalAuthToken,
} from './types';

export const LOCALSTORAGE_AUTH_KEY = 'auth_token';
const E_TOKEN_ERROR = 'Token error';
export class ApiClient {
  private static instances: Record<string, ApiClient> = {};

  private readonly instanceId: string;
  private readonly translationService: ITranslationService;
  private readonly notificationService: INotificationService;
  private readonly unauthorizedCallback?: (a: this) => void;
  private readonly loginApiPath: string;
  private readonly refreshTokenApiPath: string;
  private readonly disableAuth: boolean;
  private readonly storage: WindowLocalStorage['localStorage'];
  private token = '';
  private refreshToken = '';
  private tokenExpirationDate: Date | undefined;
  private tokenRefreshFlowPromise: Promise<boolean> | undefined;
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public expiredTokenCallback = () => {};
  private readonly keycloakClientId: string;
  private baseURL: string;

  /**
   * The Singleton's constructor should always be private to prevent direct
   * construction calls with the `new` operator.
   */
  private constructor({
    instanceId = 'default',
    notificationService,
    translationService,
    loginApiPath = '',
    refreshTokenApiPath = '',
    keycloakClientId = '',
    unauthorizedCallback,
    disableAuth = false,
    storage = globalThis.localStorage,
    baseURL,
  }: ApiClientConfig<ApiClient>) {
    this.instanceId = instanceId;
    this.translationService = translationService;
    this.notificationService = notificationService;
    this.loginApiPath = loginApiPath;
    this.refreshTokenApiPath = refreshTokenApiPath;
    this.keycloakClientId = keycloakClientId;
    this.disableAuth = disableAuth;
    this.storage = storage;
    this.unauthorizedCallback = unauthorizedCallback;

    // Will deleted by terser
    if (import.meta.env?.DEV) {
      baseURL = replaceUrlWithProxy(baseURL ?? '');
      this.loginApiPath = replaceUrlWithProxy(this.loginApiPath);
    }
    this.baseURL = baseURL;
  }

  public static getInstance(instanceId = 'default'): ApiClient {
    if (!ApiClient.instances[instanceId]) {
      throw new Error('You have to initialize api client first!');
    } else {
      return ApiClient.instances[instanceId];
    }
  }

  public static init(config: ApiClientConfig<ApiClient>): ApiClient {
    const instanceId = config.instanceId || 'default';
    if (ApiClient.instances[instanceId]) {
      throw new Error(`Api client instance with Id: ${instanceId} already initialized`);
    }

    ApiClient.instances[instanceId] = new ApiClient(config);
    return ApiClient.instances[instanceId];
  }

  /**
   * Authentication
   * @throws {ApiClientError}
   */
  private setAuth(token: string, refreshToken: string): JWTData {
    try {
      const decodedToken: JWTData = jwtDecode(token);
      if (decodedToken && decodedToken.exp) {
        const expiringDate = new Date(decodedToken.exp * 1000);
        if (expiringDate > new Date()) {
          this.token = token;
          this.refreshToken = refreshToken;
          this.tokenExpirationDate = expiringDate;
          this.storage.setItem(
            LOCALSTORAGE_AUTH_KEY,
            JSON.stringify({ token, refreshToken }),
          );
          return decodedToken;
        } else {
          console.error('Wrong token expire time');
        }
      }
    } catch (e) {
      console.error("Can't decode token", e);
    }
    throw new ApiClientError(E_TOKEN_ERROR, { kind: 'bad-data' });
  }

  getLocalAuthToken(callback: () => void): LocalAuthToken | undefined {
    this.expiredTokenCallback = callback;
    try {
      const authStr = this.storage.getItem(LOCALSTORAGE_AUTH_KEY);
      if (authStr) {
        const { token, refreshToken } = JSON.parse(authStr);
        if (token && refreshToken) {
          const jwtData = this.setAuth(token, refreshToken);
          return { token, refreshToken, jwtData };
        }
      }
    } catch (e) {}
    // local token absent or invalid
    this.resetAuth();
  }

  private resetAuth() {
    this.token = '';
    this.refreshToken = '';
    this.tokenExpirationDate = undefined;
    this.storage.removeItem(LOCALSTORAGE_AUTH_KEY);
  }

  /**
   * @throws {ApiClientError}
   */
  private async tokenRefreshFlow() {
    if (this.tokenExpirationDate) {
      const diffTime = this.tokenExpirationDate.getTime() - new Date().getTime();
      if (diffTime < 0) {
        // token expired
        this.resetAuth();
        return false;
      }

      const minutes5 = 1000 * 60 * 5;
      if (diffTime < minutes5) {
        // token expires soon - less then 5 minutes lifetime, refresh it
        const refreshResult = await this.refreshAuthToken();
        if (refreshResult && typeof refreshResult !== 'string') {
          return true;
        }
        return false;
      }
      return true;
    }
    return false;
  }

  /**
   * @throws {ApiClientError}
   */
  private async isTokenOk(): Promise<boolean> {
    if (!this.tokenRefreshFlowPromise) {
      this.tokenRefreshFlowPromise = this.tokenRefreshFlow();
    }
    const tokenCheck = await this.tokenRefreshFlowPromise;
    this.tokenRefreshFlowPromise = undefined;
    if (!tokenCheck) {
      this.expiredTokenCallback();
    }
    return tokenCheck;
  }

  /**
   * @throws {ApiClientError}
   */
  private async getResponseDataOrThrow<T>(
    response: ApiResponse<T, GeneralApiProblem>,
    errorsConfig?: RequestErrorsConfig,
  ): Promise<T | null | never> {
    if (response.ok) {
      return response.data;
    }

    // call redirection callback if user not authorized
    if (
      this.unauthorizedCallback &&
      (response.status === 401 || response.status === 403)
    ) {
      // TODO: route to login page
      this.unauthorizedCallback(this);
    }
    const problem = getGeneralApiProblem(response);

    // if there is custom error messages config use it do define error message
    // Parse error message from error body in other case
    let errorMessage = '';
    if (errorsConfig && errorsConfig.messages) {
      if (typeof errorsConfig.messages !== 'string') {
        if (response.status && response.status in errorsConfig.messages) {
          errorMessage = errorsConfig.messages[response.status];
        }
      } else {
        errorMessage = errorsConfig.messages;
      }
    }
    if (!errorMessage) {
      errorMessage = parseApiError(problem, this.translationService);
    }

    if (problem.kind === 'canceled') {
      console.debug('Request was canceled');
    } else if (errorsConfig === undefined || errorsConfig.hideErrors !== true) {
      this.notificationService.error({
        title: this.translationService.t('error'),
        description: this.translationService.t(errorMessage),
      });
    }

    throw new ApiClientError(errorMessage, problem);
  }

  /**
   * @throws {ApiClientError}
   */
  public async login(username: string, password: string): Promise<LocalAuthToken> {
    const params = {
      username: username,
      password: password,
      client_id: this.keycloakClientId,
      grant_type: 'password',
    };

    const response = await wretch(this.loginApiPath)
      .addon(FormUrlAddon)
      .formUrl(params)
      .post()
      .res(parseBody) as ApiResponse<KeycloakAuthResponse>;

    return this.consumeTokenOrThrow(response);
  }

  /**
   * @throws {ApiClientError}
   */
  public async refreshAuthToken(): Promise<LocalAuthToken | undefined> {
    const params = {
      client_id: this.keycloakClientId,
      refresh_token: this.refreshToken,
      grant_type: 'refresh_token',
    };

    const response = (await wretch(this.refreshTokenApiPath)
      .addon(FormUrlAddon)
      .formUrl(params)
      .post()
      .res(parseBody)) as ApiResponse<KeycloakAuthResponse>;

    if (response.ok) {
      return this.consumeTokenOrThrow(response);
    }
  }

  /**
   * @throws {ApiClientError}
   */
  private consumeTokenOrThrow(
    response: ApiResponse<KeycloakAuthResponse>,
  ): LocalAuthToken {
    if (response.ok && response.data && response.data.access_token) {
      const setAuthResult = this.setAuth(
        response.data.access_token,
        response.data.refresh_token,
      );
      return {
        token: response.data.access_token,
        refreshToken: response.data.refresh_token,
        jwtData: setAuthResult,
      };
    }
    if (response.data?.error_description) {
      console.error(response.data?.error_description);
    }
    throw new ApiClientError(E_TOKEN_ERROR, { kind: 'bad-data' });
  }

  async logout() {
    this.resetAuth();
  }

  public async call<T>(
    method: ApiMethod,
    path: string,
    requestParams?: unknown,
    useAuth = !this.disableAuth,
    requestConfig: CustomRequestConfig = {},
  ): Promise<T | null> {
    const RequestsWithBody = ['post', 'put', 'patch'];

    let req = wretch(this.baseURL, { mode: 'cors' })
      .addon(FormDataAddon)
      .addon(FormUrlAddon)
      .addon(QueryStringAddon)
      .url(path);

    if (requestParams) {
      req = RequestsWithBody.includes(method)
        ? req.json(requestParams)
        : req.query(requestParams);
    }

    if (requestConfig.headers) {
      req = req.headers(requestConfig.headers);
    }

    if (!this.disableAuth && useAuth && this.token) {
      const tokenOk = await this.isTokenOk();
      if (tokenOk) {
        req = req.auth(`Bearer ${this.token}`);
      }
    }

    if (requestConfig.signal) {
      req = req.options({ signal: requestConfig.signal });
    }

    const response = (await req[method]().res(parseBody)) as ApiResponse<
      T,
      GeneralApiProblem
    >;

    return this.getResponseDataOrThrow<T>(response, requestConfig?.errorsConfig);
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
async function parseBody(res) {
  if (res.ok) {
    const contentType = res.headers.get('content-type');
    if (contentType === 'application/json') {
      res.data = await res.json();
    }
  }
  return res;
}
