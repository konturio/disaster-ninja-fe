import Axios, { AxiosRequestConfig } from 'axios';
import jwt_decode from 'jwt-decode';
import {
  ApiResponse,
  ApiErrorResponse,
  ApisauceConfig,
  ApisauceInstance,
  create,
} from 'apisauce';
import { GeneralApiProblem, getGeneralApiProblem } from './ApiProblem';
import { AuthResponseData, GenericRequestResult } from './ApiTypes';
import { NotificationMessage } from '~core/types/notification';

const LOCALSTORAGE_AUTH_KEY = 'app_management_auth';

export interface INotificationService {
  error: (message: NotificationMessage, lifetimeSec?: number) => void;
}

export interface ITranslationService {
  t: (message: string) => string;
}

export interface ApiClientConfig extends ApisauceConfig {
  notificationService: INotificationService;
  translationService: ITranslationService;
  loginApiPath: string;
  refreshTokenApiPath?: string;
  unauthorizedCallback?: () => void;
}

type ApiMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';
export class ApiClient {
  private static instance: ApiClient;

  private apiSauceInstance: ApisauceInstance;
  private translationService: ITranslationService;
  private notificationService: INotificationService;
  private token = '';
  private refreshToken = '';
  private tokenWillExpire: Date | undefined;
  private checkTokenPromise: Promise<boolean> | undefined;
  private expiredTokenCallback?: () => void;
  private unauthorizedCallback?: () => void;
  private loginApiPath = '';
  private refreshTokenApiPath = '';

  /**
   * The Singleton's constructor should always be private to prevent direct
   * construction calls with the `new` operator.
   */
  private constructor({
    notificationService,
    translationService,
    loginApiPath,
    refreshTokenApiPath,
    unauthorizedCallback,
    ...apiSauceConfig
  }: ApiClientConfig) {
    this.translationService = translationService;
    this.notificationService = notificationService;
    this.loginApiPath = loginApiPath;
    this.refreshTokenApiPath = refreshTokenApiPath || '';

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

  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      throw new Error('You have to initialize api client first!');
    } else {
      return ApiClient.instance;
    }
  }

  public static init(config: ApiClientConfig) {
    ApiClient.instance = new ApiClient(config);
    return ApiClient.instance;
  }

  /**
   * Authentication
   */
  private setAuth(tkn: string, refreshTkn: string): boolean {
    const decodedToken = jwt_decode<{ exp?: number }>(tkn);
    if (decodedToken.exp) {
      const expiringDate = new Date(decodedToken.exp * 1000);
      if (expiringDate > new Date()) {
        this.token = tkn;
        this.refreshToken = refreshTkn;
        this.tokenWillExpire = expiringDate;
        localStorage.setItem(
          LOCALSTORAGE_AUTH_KEY,
          JSON.stringify({ token: tkn, refreshToken: refreshTkn }),
        );
        return true;
      }
    }

    return false;
  }

  private resetAuth() {
    this.token = '';
    this.refreshToken = '';
    this.tokenWillExpire = undefined;
    localStorage.removeItem(LOCALSTORAGE_AUTH_KEY);
  }

  private async checkTokenIsExpired() {
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
            if (refreshResult.kind === 'ok') {
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
  ): Promise<GenericRequestResult<T> | GeneralApiProblem> {
    if (!response.ok) {
      // call redirection callback if user not authorized
      if (
        this.unauthorizedCallback &&
        (response.status === 401 || response.status === 403)
      ) {
        this.unauthorizedCallback();
      }
      const problem = getGeneralApiProblem(response);
      const error = this.parseError(problem);

      this.notificationService.error({
        title: this.translationService.t('Error'),
        description: this.translationService.t(error),
      });

      return problem;
    }

    return { kind: 'ok', data: response.data };
  }

  private parseError(errorResponse: GeneralApiProblem): string {
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

  public async login(username: string, password: string) {
    const response = await this.apiSauceInstance.post<
      AuthResponseData,
      GeneralApiProblem
    >(this.loginApiPath, {
      username,
      password,
    });

    if (response.ok) {
      if (response.data) {
        this.setAuth(response.data.accessToken, response.data.refreshToken);
      }
      {
        // ? What we do if auth response 204?
      }
    }

    return this.processResponse(response);
  }

  async logout() {
    this.resetAuth();
  }

  public async refreshAuthToken() {
    const response = await this.apiSauceInstance.post<
      AuthResponseData,
      GeneralApiProblem
    >(
      this.refreshTokenApiPath,
      { accessToken: this.token, refreshToken: this.refreshToken },
      {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      },
    );

    if (response.ok) {
      if (response.data) {
        this.setAuth(response.data.accessToken, response.data.refreshToken);
      }
      {
        // ? What we do if auth response 204?
      }
    }

    return this.processResponse(response);
  }

  public async call<T>(
    method: ApiMethod,
    path: string,
    requestParams?: Record<string, unknown>,
    useAuth = true,
    axiosConfig?: AxiosRequestConfig,
  ): Promise<GenericRequestResult<T>> {
    let response: ApiResponse<T, GeneralApiProblem>;

    if (!axiosConfig) {
      axiosConfig = {};
    }

    if (useAuth) {
      const tokenCheckError = await this.checkToken(axiosConfig);
      if (tokenCheckError) {
        const proceededError = await this.processResponse<T>(tokenCheckError);
        return proceededError;
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

    return this.processResponse<T>(response);
  }

  // method shortcuts
  public async get<T>(
    path: string,
    requestParams?: Record<string, unknown>,
    useAuth = true,
    axiosConfig?: AxiosRequestConfig,
  ): Promise<GenericRequestResult<T>> {
    return this.call<T>('get', path, requestParams, useAuth, axiosConfig);
  }

  public async post<T>(
    path: string,
    requestParams?: Record<string, unknown>,
    useAuth = true,
    axiosConfig?: AxiosRequestConfig,
  ): Promise<GenericRequestResult<T>> {
    return this.call('post', path, requestParams, useAuth, axiosConfig);
  }

  public async put<T>(
    path: string,
    requestParams?: Record<string, unknown>,
    useAuth = true,
    axiosConfig?: AxiosRequestConfig,
  ): Promise<GenericRequestResult<T>> {
    return this.call('put', path, requestParams, useAuth, axiosConfig);
  }

  public async patch<T>(
    path: string,
    requestParams?: Record<string, unknown>,
    useAuth = true,
    axiosConfig?: AxiosRequestConfig,
  ): Promise<GenericRequestResult<T>> {
    return this.call('patch', path, requestParams, useAuth, axiosConfig);
  }

  public async delete<T>(
    path: string,
    useAuth = true,
    axiosConfig?: AxiosRequestConfig,
  ): Promise<GenericRequestResult<T>> {
    return this.call('delete', path, undefined, useAuth, axiosConfig);
  }
}

export const apiClient = ApiClient.getInstance();
