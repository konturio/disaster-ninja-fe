import wretch from 'wretch';
import QueryStringAddon from 'wretch/addons/queryString';
import { replaceUrlWithProxy } from '~utils/axios/replaceUrlWithProxy';
import { wait } from '~utils/test/wait';
import { goTo } from '~core/router/goTo';
import { createApiError } from './errors';
import { ApiMethodTypes } from './types';
import { autoParseBody } from './utils';
import type { ApiClientError } from './apiClientError';
import type {
  ApiClientConfig,
  ApiMethod,
  CustomRequestConfig,
  GeneralApiProblem,
  RequestParams,
} from './types';
import type { OidcSimpleClient } from '~core/auth/OidcSimpleClient';

type EventMap = {
  error: ApiClientError;
  poolUpdate: Map<string, string>;
  idle: boolean;
};

type EventType = keyof EventMap;
type Listener<T> = (arg: T) => void;
type ListenerMap = {
  [K in EventType]: Set<Listener<EventMap[K]>>;
};

export class ApiClient {
  private listeners: ListenerMap = {
    error: new Set(),
    poolUpdate: new Set(),
    idle: new Set(),
  };
  private baseURL!: string;
  private requestPool = new Map<string, string>();

  authService!: OidcSimpleClient;

  constructor({ on }: { on?: { [K in EventType]?: Listener<EventMap[K]> } } = {}) {
    if (on) {
      (Object.entries(on) as [EventType, Listener<EventMap[EventType]>][]).forEach(
        ([event, cb]) => {
          if (cb) this.on(event, cb);
        },
      );
    }
  }

  public on<E extends EventType>(event: E, cb: Listener<EventMap[E]>): () => void {
    this.listeners[event].add(cb);
    return () => {
      this.listeners[event].delete(cb);
    };
  }

  private _emit<E extends EventType>(type: E, payload: EventMap[E]): void {
    this.listeners[type].forEach((l) => l(payload));
  }

  public init(cfg: ApiClientConfig) {
    let baseURL = cfg.baseUrl ?? '';
    if (import.meta.env.DEV) {
      baseURL = replaceUrlWithProxy(baseURL);
    }
    this.baseURL = baseURL;
  }

  private updateRequestPool(requestId: string, status: string | null): void {
    if (status === null) {
      this.requestPool.delete(requestId);
    } else {
      this.requestPool.set(requestId, status);
    }
    this._emit('poolUpdate', new Map(this.requestPool));
    this._emit('idle', this.requestPool.size === 0);
  }

  private async call<T>(
    method: ApiMethod,
    path: string,
    requestParams?: unknown,
    useAuth = false,
    requestConfig: CustomRequestConfig = {},
  ): Promise<T | null> {
    const RequestsWithBody = ['post', 'put', 'patch'];
    let req;

    const requestId = Math.random().toString(36).substring(7);
    this.updateRequestPool(requestId, 'pending');

    if (path.startsWith('http')) {
      const url = new URL(path);
      req = wretch(url.origin, { mode: 'cors' })
        .addon(QueryStringAddon)
        .url(url.pathname);
    } else {
      req = wretch(this.baseURL, { mode: 'cors' }).addon(QueryStringAddon).url(path);
    }

    if (requestConfig.signal) {
      req = req.options({ signal: requestConfig.signal });
    }

    if (requestConfig.headers) {
      req = req.headers(requestConfig.headers);
    }

    let isAuthenticatedRequest = false;

    if (useAuth) {
      const token = await this.authService.getAccessToken();
      if (token) {
        isAuthenticatedRequest = true;
        req = req.auth(`Bearer ${token}`).catcher(401, async (_, originalRequest) => {
          const token = await this.authService.getAccessToken();
          // replay original request with new token
          return originalRequest
            .auth(`Bearer ${token}`)
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
      this.updateRequestPool(requestId, null);
      return response.data as T;
    } catch (err) {
      this.updateRequestPool(requestId, null);
      const apiError = createApiError(err);

      if (apiError.problem.kind === 'canceled') {
        throw apiError;
      }

      if (isAuthenticatedRequest && apiError.problem.kind === 'unauthorized') {
        try {
          // sometimes infrastructure returns 401
          // try refreshing token to ensure it's auth problem and not infrastructure error
          const token = await this.authService.getAccessToken();
        } catch (error) {
          // logout is handled in authService for this case
          goTo('/profile');
        }
        throw apiError;
      }

      // Handle retries with defaults
      const defaultRetryConfig = {
        attempts: 0,
        delayMs: 1000,
        onErrorKinds: ['timeout'] as Array<GeneralApiProblem['kind']>,
      };

      const retryConfig = {
        ...defaultRetryConfig,
        ...requestConfig.retry,
        onErrorKinds:
          requestConfig.retry?.onErrorKinds ?? defaultRetryConfig.onErrorKinds,
      };

      if (retryConfig.attempts > 0) {
        const shouldRetry = retryConfig.onErrorKinds.includes(apiError.problem.kind);

        if (shouldRetry) {
          if (retryConfig.delayMs) {
            await wait(retryConfig.delayMs / 1000);
          }
          return this.call(method, path, requestParams, useAuth, {
            ...requestConfig,
            retry: {
              ...retryConfig,
              attempts: retryConfig.attempts - 1,
            },
          });
        }
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
    useAuth = false,
    requestConfig?: CustomRequestConfig,
  ): Promise<T | null> {
    return this.call<T>(ApiMethodTypes.GET, path, requestParams, useAuth, requestConfig);
  }

  public async post<T>(
    path: string,
    requestParams?: unknown,
    useAuth = false,
    requestConfig?: CustomRequestConfig,
  ): Promise<T | null> {
    return this.call(ApiMethodTypes.POST, path, requestParams, useAuth, requestConfig);
  }

  public async put<T>(
    path: string,
    requestParams?: RequestParams,
    useAuth = false,
    requestConfig?: CustomRequestConfig,
  ): Promise<T | null> {
    return this.call(ApiMethodTypes.PUT, path, requestParams, useAuth, requestConfig);
  }

  public async patch<T>(
    path: string,
    requestParams?: RequestParams,
    useAuth = false,
    requestConfig?: CustomRequestConfig,
  ): Promise<T | null> {
    return this.call(ApiMethodTypes.PATCH, path, requestParams, useAuth, requestConfig);
  }

  public async delete<T>(
    path: string,
    useAuth = false,
    requestConfig?: CustomRequestConfig,
  ): Promise<T | null> {
    return this.call(ApiMethodTypes.DELETE, path, undefined, useAuth, requestConfig);
  }
}
