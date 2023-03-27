import wretch from 'wretch';
import QueryStringAddon from 'wretch/addons/queryString';
import FormUrlAddon from 'wretch/addons/formUrl';
import FormDataAddon from 'wretch/addons/formData';
import AbortAddon from 'wretch/addons/abort';
import jwtDecode from 'jwt-decode';
import { replaceUrlWithProxy } from '~utils/axios/replaceUrlWithProxy';
import { ApiMethodTypes, getGeneralApiProblem } from './types';
import { ApiClientError } from './apiClientError';
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
  private checkTokenPromise: Promise<boolean> | undefined;
  public expiredTokenCallback?: () => void;
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
   */
  private setAuth(token: string, refreshToken: string): JWTData | string {
    let decodedToken: JWTData | undefined;

    try {
      decodedToken = jwtDecode(token);
    } catch (e) {
      return "Can't decode token!";
    }

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
        return 'Wrong token expire time!';
      }
    }

    return 'Wrong data received!';
  }

  getLocalAuthToken(callback: () => void): LocalAuthToken | undefined {
    this.expiredTokenCallback = callback;
    const authStr = this.storage.getItem(LOCALSTORAGE_AUTH_KEY);
    if (authStr) {
      const { token, refreshToken } = JSON.parse(authStr);
      if (token && refreshToken) {
        const jwtData = this.setAuth(token, refreshToken);
        if (typeof jwtData === 'string') {
          this.resetAuth();
          // FIXME: implement correct i18n usage for errors, do not translationService.t(var) !!!
          throw new ApiClientError(this.translationService.t(jwtData), {
            kind: 'bad-data',
          });
        }
        return { token, refreshToken, jwtData };
      }
    }
  }

  private resetAuth() {
    this.token = '';
    this.refreshToken = '';
    this.tokenExpirationDate = undefined;
    this.storage.removeItem(LOCALSTORAGE_AUTH_KEY);
  }

  private async checkTokenIsExpired(): Promise<boolean> {
    if (!this.checkTokenPromise) {
      // eslint-disable-next-line no-async-promise-executor
      this.checkTokenPromise = new Promise<boolean>(async (resolve) => {
        // if token has less then 5 minutes lifetime, refresh it
        if (this.tokenExpirationDate) {
          const diffTime = this.tokenExpirationDate.getTime() - new Date().getTime();
          if (diffTime < 0) {
            this.resetAuth();
            if (this.expiredTokenCallback) {
              this.expiredTokenCallback();
            }
            resolve(false);
            return false;
          }
          const minutes5 = 1000 * 60 * 5;
          if (diffTime < minutes5) {
            const refreshResult = await this.refreshAuthToken();
            if (refreshResult && typeof refreshResult !== 'string') {
              resolve(true);
              return true;
            }
            if (this.expiredTokenCallback) {
              this.expiredTokenCallback();
            }
            resolve(false);
            return false;
          }
          resolve(true);
          return true;
        }

        if (this.expiredTokenCallback) {
          this.expiredTokenCallback();
        }
        resolve(false);
        return false;
      });
    }

    const res = await this.checkTokenPromise;
    this.checkTokenPromise = undefined;
    return res;
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

  private async checkToken(
    axiosConfig: AxiosRequestConfig,
  ): Promise<ApiErrorResponse<GeneralApiProblem> | false> {
    const tokenCheck = await this.checkTokenIsExpired();
    if (!tokenCheck) {
      const originalError = {
        isAxiosError: false,
        message: 'TOKEN ERROR',
        name: 'Token error',
        config: axiosConfig,
      };

      return {
        ok: false,
        problem: 'CLIENT_ERROR',
        status: 401,
        originalError: {
          ...originalError,
          toJSON: () => originalError,
        },
      };
    }

    return false;
  }

  public async login(
    username: string,
    password: string,
  ): Promise<LocalAuthToken | string | undefined> {
    const params = {
      username: username,
      password: password,
      client_id: this.keycloakClientId,
      grant_type: 'password',
    };

    // : ApiResponse<KeycloakAuthResponse, GeneralApiProblem>
    const response = await wretch(this.loginApiPath)
      .addon(FormUrlAddon)
      .formUrl(params)
      .post()
      .res();

    if (response.ok) {
      response.data = await response.json();
      return this.consumeTokenOrThrow(response);
    } else {
      return response.data?.error_description;
    }
  }

  /**
   * @returns {Promise} {LocalAuthToken} | {string} with error,
   * @throws {ApiClientError}
   */
  public async refreshAuthToken(): Promise<string | LocalAuthToken | undefined> {
    const params = {
      client_id: this.keycloakClientId,
      refresh_token: this.refreshToken,
      grant_type: 'refresh_token',
    };

    const response = await wretch(this.refreshTokenApiPath)
      .addon(FormUrlAddon)
      .formUrl(params)
      .post()
      .res();

    if (response.ok) {
      response.data = await response.json();
      return this.consumeTokenOrThrow(response);
    } else {
      return response.data?.error_description;
    }
  }

  /**
   * @throws {ApiClientError}
   */
  private consumeTokenOrThrow(
    response: ApiResponse<KeycloakAuthResponse, GeneralApiProblem>,
  ): LocalAuthToken | undefined {
    if (response.ok) {
      if (response.data && response.data.access_token) {
        const setAuthResult = this.setAuth(
          response.data.access_token,
          response.data.refresh_token,
        );

        if (typeof setAuthResult === 'string') {
          throw new ApiClientError(this.translationService.t(setAuthResult), {
            kind: 'bad-data',
          });
        } else {
          return {
            token: response.data.access_token,
            refreshToken: response.data.refresh_token,
            jwtData: setAuthResult,
          };
        }
      } else {
        if (response.status === 204) {
          throw new ApiClientError(this.translationService.t('no_data_received'), {
            kind: 'no-data',
          });
        } else {
          throw new ApiClientError(this.translationService.t('wrong_data_received'), {
            kind: 'bad-data',
          });
        }
      }
    }
  }

  async logout() {
    this.resetAuth();
  }
  public async call<T>(
    method: ApiMethod,
    path: string,
    requestParams?: unknown,
    useAuth = !this.disableAuth,
    requestConfig?: CustomRequestConfig,
  ): Promise<T | null> {
    if (!requestConfig) {
      requestConfig = {};
    }

    const RequestsWithBody = ['post', 'put', 'patch'];

    if (!this.disableAuth && useAuth && this.token) {
      const tokenCheckError = await this.checkToken(requestConfig);
      if (tokenCheckError) {
        return await this.getResponseDataOrThrow<T>(
          tokenCheckError,
          requestConfig?.errorsConfig,
        );
      }

      if (!requestConfig.headers) {
        requestConfig.headers = {};
      }

      if (!requestConfig.headers.Authorization) {
        requestConfig.headers.Authorization = `Bearer ${this.token}`;
      }
    }

    let req = wretch(this.baseURL, { mode: 'cors' })
      .addon(FormDataAddon)
      .addon(FormUrlAddon)
      .addon(QueryStringAddon)
      .addon(AbortAddon());

    if (requestParams) {
      req = RequestsWithBody.includes(method)
        ? req.json(requestParams)
        : req.query(requestParams);
    }

    if (requestConfig.headers) {
      req = req.headers(requestConfig.headers);
    }

    if (requestConfig.signal) {
      req = req.options({ signal: requestConfig.signal });
    }

    const response = await req
      .url(path)
      [method]()
      .res((res) => {
        console.debug(res);
        return res;
      });

    if (response.ok) {
      response.data = await response.json();
    }

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

function parseApiError(
  errorResponse: GeneralApiProblem,
  i18n: ITranslationService,
): string {
  if (errorResponse && 'data' in errorResponse) {
    const { data: errorData } = errorResponse;
    if (errorData !== null) {
      if (Array.isArray(errorData)) {
        return errorData
          .map((errorMsg) =>
            errorMsg.name && errorMsg.message
              ? `${errorMsg.name}: ${errorMsg.message}`
              : errorMsg,
          )
          .join('<br/>');
      }
      if (errorData instanceof Object) {
        if (errorData.hasOwnProperty('error')) return errorData['error'];
        if (errorData.hasOwnProperty('errors') && Array.isArray(errorData['errors'])) {
          return errorData['errors']
            .reduce((acc, errorObj) => {
              if (errorObj.hasOwnProperty('message')) {
                acc.push(errorObj['message']);
              }
              return acc;
            }, [])
            .join('<br/>');
        }
      }

      return String(errorData);
    }

    return 'Unknown Error';
  }

  switch (errorResponse.kind) {
    case 'timeout':
      return i18n.t('errors.timeout');
    case 'cannot-connect':
      return i18n.t('errors.cannot_connect');
    case 'forbidden':
      return i18n.t('errors.forbidden');
    case 'not-found':
      return i18n.t('errors.not_found');
    case 'unknown':
      return i18n.t('errors.unknown');
    default:
      return i18n.t('errors.server_error');
  }
}
