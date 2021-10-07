import Axios, { AxiosRequestConfig } from 'axios';
import jwt_decode from 'jwt-decode';
import {
  ApiResponse,
  ApisauceConfig,
  ApisauceInstance,
  create,
} from 'apisauce';
import { GeneralApiProblem, getGeneralApiProblem } from './ApiProblem';
import { GenericRequestResult, LoginRequestResult } from './ApiTypes';
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

export enum ApiMethod {
  get = 'get',
  post = 'post',
  put = 'put',
  patch = 'patch',
  delete = 'delete',
}

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
    const decodedToken: any = jwt_decode(tkn);
    if (decodedToken) {
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

  private async processResponse(
    response: ApiResponse<any>,
  ): Promise<GenericRequestResult> {
    if (!response.ok) {
      // call redirection callback if user not authorized
      if (
        this.unauthorizedCallback &&
        (response.status === 401 || response.status === 403)
      ) {
        this.unauthorizedCallback();
      }
      const problem = getGeneralApiProblem(response);

      if (problem) {
        const error = this.parseError(problem);
        this.notificationService.error({
          title: this.translationService.t('Error'),
          description: this.translationService.t(error),
        });
        return problem;
      }
    }

    return { kind: 'ok', data: response.data };
  }

  private parseError(errorResponse: GeneralApiProblem): string {
    const serverError = errorResponse as { data: any };
    if (serverError && serverError.data) {
      if (typeof serverError.data === 'string') {
        if (typeof serverError.data === 'string') {
          try {
            let jsonPart = serverError.data;
            const ind1 = serverError.data.indexOf('{');
            const ind2 = serverError.data.indexOf('}');
            if (ind1 !== -1 && ind1 !== 0 && ind2 !== -1) {
              jsonPart = serverError.data.slice(ind1, ind2 + 1);
            }
            const parsedData = JSON.parse(jsonPart);
            if (typeof parsedData && parsedData.message) {
              return parsedData.message;
            }
            return parsedData;
          } catch (e) {
            return serverError.data;
          }
        }
      }
      if (serverError.data.error) {
        return serverError.data.error;
      }
      if (Array.isArray(serverError.data)) {
        return serverError.data
          .map((errorMsg) =>
            errorMsg.name && errorMsg.message
              ? `${errorMsg.name}: ${errorMsg.message}`
              : errorMsg,
          )
          .join('<br/>');
      }

      return serverError.data.name && serverError.data.message
        ? `${serverError.data.name}: ${serverError.data.message}`
        : Object.entries(serverError.data)
            .map(([, errorEntry]) => errorEntry)
            .join('<br/>');
    }

    switch (errorResponse.kind) {
      case 'timeout':
        return 'Request Timeout';
      case 'cannot-connect':
        return "Can't connect to server";
      case 'unauthorized':
        return 'Not authorized';
      case 'forbidden':
        return 'Forbidden';
      case 'not-found':
        return 'Not found';
      case 'unknown':
        return 'Unknown';
      default:
        return 'Server Error';
    }

    return 'Server Error';
  }

  private async checkToken(): Promise<any> {
    const tokenCheck = await this.checkTokenIsExpired();
    if (!tokenCheck) {
      return {
        ok: false,
        problem: 'CLIENT_ERROR',
        status: 401,
        originalError: null,
      };
    }

    return false;
  }

  public async login(
    username: string,
    password: string,
  ): Promise<LoginRequestResult> {
    const response: ApiResponse<any> = await this.apiSauceInstance.post(
      this.loginApiPath,
      { username, password },
    );

    if (response.ok) {
      this.setAuth(response.data.accessToken, response.data.refreshToken);
    }

    return this.processResponse(response);
  }

  async logout() {
    this.resetAuth();
  }

  public async refreshAuthToken(): Promise<LoginRequestResult> {
    const response: ApiResponse<any> = await this.apiSauceInstance.post(
      this.refreshTokenApiPath,
      { accessToken: this.token, refreshToken: this.refreshToken },
      {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      },
    );

    if (response.ok) {
      this.setAuth(response.data.accessToken, response.data.refreshToken);
    }

    return this.processResponse(response);
  }

  public async call(
    method: ApiMethod,
    path: string,
    requestParams?: Record<string, unknown>,
    useAuth = true,
    axiosConfig?: AxiosRequestConfig,
  ): Promise<GenericRequestResult> {
    let response;

    if (useAuth) {
      const apiCheck = await this.checkToken();
      if (apiCheck) {
        return apiCheck;
      }

      if (!axiosConfig) {
        axiosConfig = {};
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

    return this.processResponse(response);
  }

  // method shortcuts
  public async get(
    path: string,
    requestParams?: Record<string, unknown>,
    useAuth = true,
    axiosConfig?: AxiosRequestConfig,
  ): Promise<GenericRequestResult> {
    return this.call(ApiMethod.get, path, requestParams, useAuth, axiosConfig);
  }

  public async post(
    path: string,
    requestParams?: Record<string, unknown>,
    useAuth = true,
    axiosConfig?: AxiosRequestConfig,
  ): Promise<GenericRequestResult> {
    return this.call(ApiMethod.post, path, requestParams, useAuth, axiosConfig);
  }

  public async put(
    path: string,
    requestParams?: Record<string, unknown>,
    useAuth = true,
    axiosConfig?: AxiosRequestConfig,
  ): Promise<GenericRequestResult> {
    return this.call(ApiMethod.put, path, requestParams, useAuth, axiosConfig);
  }

  public async patch(
    path: string,
    requestParams?: Record<string, unknown>,
    useAuth = true,
    axiosConfig?: AxiosRequestConfig,
  ): Promise<GenericRequestResult> {
    return this.call(
      ApiMethod.patch,
      path,
      requestParams,
      useAuth,
      axiosConfig,
    );
  }

  public async delete(
    path: string,
    useAuth = true,
    axiosConfig?: AxiosRequestConfig,
  ): Promise<GenericRequestResult> {
    return this.call(ApiMethod.delete, path, undefined, useAuth, axiosConfig);
  }
}
