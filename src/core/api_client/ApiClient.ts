import { AxiosRequestConfig } from 'axios';
import jwtDecode from 'jwt-decode';
import {
  ApiErrorResponse,
  ApiResponse,
  ApisauceConfig,
  ApisauceInstance,
  create,
} from 'apisauce';
import {
  ApiClientError,
  GeneralApiProblem,
  getGeneralApiProblem,
} from './ApiProblem';
import { JWTData, KeycloakAuthResponse, RequestParams } from './ApiTypes';
import { NotificationMessage } from '~core/types/notification';
import { replaceUrlWithProxy } from '../../../vite.proxy';
import config from '~core/app_config';

const LOCALSTORAGE_AUTH_KEY = 'auth_token';

export interface INotificationService {
  error: (message: NotificationMessage, lifetimeSec?: number) => void;
}

export interface ITranslationService {
  t: (message: string) => string;
}

export interface ApiClientConfig extends ApisauceConfig {
  instanceId?: string;
  notificationService: INotificationService;
  translationService: ITranslationService;
  loginApiPath?: string;
  refreshTokenApiPath?: string;
  unauthorizedCallback?: () => void;
  disableAuth?: boolean;
  storage?: WindowLocalStorage['localStorage'];
}

type ApiMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

export class ApiClient {
  private static instances: Record<string, ApiClient> = {};

  private readonly instanceId: string;
  private readonly translationService: ITranslationService;
  private readonly notificationService: INotificationService;
  private readonly unauthorizedCallback?: () => void;
  private readonly loginApiPath: string;
  private readonly refreshTokenApiPath: string;
  private readonly apiSauceInstance: ApisauceInstance;
  private readonly disableAuth: boolean;
  private readonly storage: WindowLocalStorage['localStorage'];
  private token = '';
  private refreshToken = '';
  private tokenWillExpire: Date | undefined;
  private checkTokenPromise: Promise<boolean> | undefined;
  private expiredTokenCallback?: () => void;

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
    unauthorizedCallback,
    disableAuth = false,
    storage = window.localStorage,
    ...apiSauceConfig
  }: ApiClientConfig) {
    this.instanceId = instanceId;
    this.translationService = translationService;
    this.notificationService = notificationService;
    this.loginApiPath = loginApiPath;
    this.refreshTokenApiPath = refreshTokenApiPath;
    this.disableAuth = disableAuth;
    this.storage = storage;

    // Will deleted by terser
    if (import.meta?.env?.DEV) {
      apiSauceConfig.baseURL = replaceUrlWithProxy(
        apiSauceConfig.baseURL ?? '',
      );
      this.loginApiPath = replaceUrlWithProxy(this.loginApiPath);
    }

    if (!apiSauceConfig.headers) {
      apiSauceConfig.headers = {};
    }

    if (!apiSauceConfig.headers['Content-Type']) {
      apiSauceConfig.headers['Content-Type'] = 'application/json';
    }

    if (!apiSauceConfig.headers['Accept']) {
      apiSauceConfig.headers['Accept'] = 'application/json';
    }

    this.apiSauceInstance = create(apiSauceConfig);
  }

  public static getInstance(instanceId = 'default'): ApiClient {
    if (!ApiClient.instances[instanceId]) {
      throw new Error('You have to initialize api client first!');
    } else {
      return ApiClient.instances[instanceId];
    }
  }

  public static init(config: ApiClientConfig): ApiClient {
    const instanceId = config.instanceId || 'default';
    if (ApiClient.instances[instanceId]) {
      throw new Error(
        `Api client instance with Id: ${instanceId} already initialized`,
      );
    }

    ApiClient.instances[instanceId] = new ApiClient(config);
    return ApiClient.instances[instanceId];
  }

  /**
   * Authentication
   */
  private setAuth(tkn: string, refreshTkn: string): JWTData | string {
    let decodedToken: JWTData | undefined;

    try {
      decodedToken = jwtDecode(tkn);
    } catch (e) {
      return "Can't decode token!";
    }

    if (decodedToken && decodedToken.exp) {
      const expiringDate = new Date(decodedToken.exp * 1000);
      if (expiringDate > new Date()) {
        this.token = tkn;
        this.refreshToken = refreshTkn;
        this.tokenWillExpire = expiringDate;
        this.storage.setItem(
          LOCALSTORAGE_AUTH_KEY,
          JSON.stringify({ token: tkn, refreshToken: refreshTkn }),
        );
        return decodedToken;
      } else {
        return 'Wrong token expire time!';
      }
    }

    return 'Wrong data received!';
  }

  async checkAuth(
    callback: () => void,
  ): Promise<
    { token: string; refreshToken: string; jwtData: JWTData } | undefined
  > {
    this.expiredTokenCallback = callback;
    const authStr = localStorage.getItem(LOCALSTORAGE_AUTH_KEY);
    if (authStr) {
      const auth = JSON.parse(authStr);
      if (auth.token && auth.refreshToken) {
        const setAuthResult = this.setAuth(auth.token, auth.refreshToken);
        if (typeof setAuthResult === 'string') {
          localStorage.removeItem(LOCALSTORAGE_AUTH_KEY);
          throw new ApiClientError(this.translationService.t(setAuthResult), {
            kind: 'bad-data',
          });
        }
        return {
          token: auth.token,
          refreshToken: auth.refreshToken,
          jwtData: setAuthResult,
        };
      }
    }
  }

  private resetAuth() {
    this.token = '';
    this.refreshToken = '';
    this.tokenWillExpire = undefined;
    this.storage.removeItem(LOCALSTORAGE_AUTH_KEY);
  }

  private async checkTokenIsExpired(): Promise<boolean> {
    if (!this.checkTokenPromise) {
      // eslint-disable-next-line no-async-promise-executor
      this.checkTokenPromise = new Promise<boolean>(async (resolve) => {
        // if token has less then 5 minutes lifetime, refresh it
        if (this.tokenWillExpire) {
          const diffTime =
            this.tokenWillExpire.getTime() - new Date().getTime();
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

  private async processResponse<T>(
    response: ApiResponse<T, GeneralApiProblem>,
  ): Promise<T | undefined | never> {
    if (response.ok) {
      return response.data;
    }

    // call redirection callback if user not authorized
    if (
      this.unauthorizedCallback &&
      (response.status === 401 || response.status === 403)
    ) {
      this.unauthorizedCallback();
    }

    const problem = getGeneralApiProblem(response);
    const errorMessage = ApiClient.parseError(problem);

    this.notificationService.error({
      title: this.translationService.t('Error'),
      description: this.translationService.t(errorMessage),
    });

    throw new ApiClientError(errorMessage, problem);
  }

  private static parseError(errorResponse: GeneralApiProblem): string {
    if (errorResponse && 'data' in errorResponse) {
      const { data: errorData } = errorResponse;
      if (errorData !== null) {
        // Array
        if (Array.isArray(errorData)) {
          return errorData
            .map((errorMsg) =>
              errorMsg.name && errorMsg.message
                ? `${errorMsg.name}: ${errorMsg.message}`
                : errorMsg,
            )
            .join('<br/>');
        }
        // Object
        if (errorData instanceof Object) {
          const errorDataRecord: { error?: string } = errorData;
          if (errorDataRecord.error) return errorDataRecord.error;
        }

        return String(errorData);
      }

      return 'Unknown Error';
    }

    switch (errorResponse.kind) {
      case 'timeout':
        return 'Request Timeout';
      case 'cannot-connect':
        return "Can't connect to server";
      case 'forbidden':
        return 'Forbidden';
      case 'not-found':
        return 'Not found';
      case 'unknown':
        return 'Unknown';
      default:
        return 'Server Error';
    }
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
  ): Promise<
    | { token: string; refreshToken: string; jwtData: JWTData }
    | string
    | undefined
  > {
    const params = new URLSearchParams();
    params.append('username', username);
    params.append('password', password);
    params.append('client_id', config.keycloakClientId);
    params.append('grant_type', 'password');

    const response = await this.apiSauceInstance.post<KeycloakAuthResponse>(
      this.loginApiPath,
      params,
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
    );

    if (response.ok) {
      return this.processAuthResponse(response);
    } else {
      return response.data?.error_description;
    }
  }

  private processAuthResponse(
    response: ApiResponse<KeycloakAuthResponse, GeneralApiProblem>,
  ): { token: string; refreshToken: string; jwtData: JWTData } | undefined {
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
          throw new ApiClientError(
            this.translationService.t('No data received!'),
            { kind: 'no-data' },
          );
        } else {
          throw new ApiClientError(
            this.translationService.t('Wrong data received!'),
            { kind: 'bad-data' },
          );
        }
      }
    }
  }

  async logout() {
    this.resetAuth();
  }

  public async refreshAuthToken(): Promise<
    | { token: string; refreshToken: string; jwtData: JWTData }
    | string
    | undefined
  > {
    const params = new URLSearchParams();
    params.append('client_id', config.keycloakClientId);
    params.append('refresh_token', this.refreshToken);
    params.append('grant_type', 'refresh_token');

    const response = await this.apiSauceInstance.post<KeycloakAuthResponse>(
      this.refreshTokenApiPath,
      params,
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
    );

    if (response.ok) {
      return this.processAuthResponse(response);
    } else {
      return response.data?.error_description;
    }
  }

  public async call<T>(
    method: ApiMethod,
    path: string,
    requestParams?: unknown,
    useAuth = !this.disableAuth,
    axiosConfig?: AxiosRequestConfig,
  ): Promise<T | undefined> {
    let response: ApiResponse<T, GeneralApiProblem>;

    if (!axiosConfig) {
      axiosConfig = {};
    }

    if (!this.disableAuth && useAuth && this.token) {
      const tokenCheckError = await this.checkToken(axiosConfig);
      if (tokenCheckError) {
        return await this.processResponse<T>(tokenCheckError);
      }

      if (!axiosConfig.headers || !axiosConfig.headers.Authorization) {
        axiosConfig.headers = {
          Authorization: `Bearer ${this.token}`,
        };
      }

      response = await this.apiSauceInstance[method](
        path,
        requestParams,
        axiosConfig,
      );
    } else {
      response = await this.apiSauceInstance[method](
        path,
        requestParams,
        axiosConfig,
      );
    }

    const res = this.processResponse<T>(response);

    return res;
  }

  // method shortcuts
  public async get<T>(
    path: string,
    requestParams?: RequestParams,
    useAuth = !this.disableAuth,
    axiosConfig?: AxiosRequestConfig,
  ): Promise<T | undefined> {
    return this.call<T>('get', path, requestParams, useAuth, axiosConfig);
  }

  public async post<T>(
    path: string,
    requestParams?: unknown,
    useAuth = !this.disableAuth,
    axiosConfig?: AxiosRequestConfig,
  ): Promise<T | undefined> {
    return this.call('post', path, requestParams, useAuth, axiosConfig);
  }

  public async put<T>(
    path: string,
    requestParams?: RequestParams,
    useAuth = !this.disableAuth,
    axiosConfig?: AxiosRequestConfig,
  ): Promise<T | undefined> {
    return this.call('put', path, requestParams, useAuth, axiosConfig);
  }

  public async patch<T>(
    path: string,
    requestParams?: RequestParams,
    useAuth = !this.disableAuth,
    axiosConfig?: AxiosRequestConfig,
  ): Promise<T | undefined> {
    return this.call('patch', path, requestParams, useAuth, axiosConfig);
  }

  public async delete<T>(
    path: string,
    useAuth = !this.disableAuth,
    axiosConfig?: AxiosRequestConfig,
  ): Promise<T | undefined> {
    return this.call('delete', path, undefined, useAuth, axiosConfig);
  }
}
