import wretch from 'wretch';
import QueryStringAddon from 'wretch/addons/queryString';
import { AUTH_REQUIREMENT } from '~core/auth/constants';
import { replaceUrlWithProxy } from '~utils/axios/replaceUrlWithProxy';
import { wait } from '~utils/test/wait';
import { getApiErrorKind } from './apiClientError';
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

  /**
   * Makes an HTTP request with configurable authentication behavior
   * @template T - The expected response type
   * @param {ApiMethod} method - HTTP method to use
   * @param {string} path - Request URL or path
   * @param {unknown} [requestParams] - Query parameters or body data
   * @param {CustomRequestConfig} [requestConfig] - Additional request configuration
   * @param {AuthRequirement} [requestConfig.authRequirement] - Authentication requirement level:
   *   - MUST: Request will fail if user is not authenticated
   *   - SHOULD: Will try to authenticate but proceed without token if not possible
   *   - OPTIONAL (default): Will include auth token if available
   *   - NEVER: Explicitly prevents authentication. Use for endpoints that must be called without auth:
   *     - Authentication endpoints (login, register)
   *     - Token refresh endpoints
   *     - Public health checks
   *     - Public API documentation
   * @returns {Promise<T | null>} The response data
   * @throws {ApiClientError} On request failure or auth requirement not met
   */
  private async call<T>(
    method: ApiMethod,
    path: string,
    requestParams?: unknown,
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

    const authRequirement = requestConfig.authRequirement ?? AUTH_REQUIREMENT.OPTIONAL;

    // For endpoints that must not be authenticated
    if (authRequirement === AUTH_REQUIREMENT.NEVER) {
      // Explicitly avoid adding any auth headers
      req = req.headers({ Authorization: '' });
    } else {
      const token = await this.authService.getAccessToken({
        requirement: authRequirement,
      });

      if (token) {
        isAuthenticatedRequest = true;
        req = req.auth(`Bearer ${token}`).catcher(401, async (error, originalRequest) => {
          try {
            const token = await this.authService.getAccessToken();
            if (!token) {
              throw error;
            }
            // replay original request with new token
            return originalRequest
              .auth(`Bearer ${token}`)
              .fetch()
              .unauthorized((err) => {
                // Redefine unauthorized hook to prevent infinite loops with multiple 401 errors
                throw err;
              })
              .res(autoParseBody);
          } catch (refreshError) {
            // Always throw the original API error to preserve its message
            throw createApiError(error);
          }
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

      if (getApiErrorKind(apiError) === 'canceled') {
        throw apiError;
      }

      if (isAuthenticatedRequest && getApiErrorKind(apiError) === 'unauthorized') {
        try {
          // sometimes infrastructure returns 401
          // try refreshing token to ensure it's auth problem and not infrastructure error
          const token = await this.authService.getAccessToken();
          if (!token) {
            throw apiError;
          }
        } catch (error) {
          // Always throw the original API error
          throw apiError;
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
        const shouldRetry = retryConfig.onErrorKinds.includes(
          getApiErrorKind(apiError) as GeneralApiProblem['kind'],
        );

        if (shouldRetry) {
          if (retryConfig.delayMs) {
            await wait(retryConfig.delayMs / 1000);
          }
          return this.call(method, path, requestParams, {
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
    requestConfig?: CustomRequestConfig,
  ): Promise<T | null> {
    return this.call<T>(ApiMethodTypes.GET, path, requestParams, requestConfig);
  }

  public async post<T>(
    path: string,
    requestParams?: unknown,
    requestConfig?: CustomRequestConfig,
  ): Promise<T | null> {
    return this.call(ApiMethodTypes.POST, path, requestParams, requestConfig);
  }

  public async put<T>(
    path: string,
    requestParams?: RequestParams,
    requestConfig?: CustomRequestConfig,
  ): Promise<T | null> {
    return this.call(ApiMethodTypes.PUT, path, requestParams, requestConfig);
  }

  public async patch<T>(
    path: string,
    requestParams?: RequestParams,
    requestConfig?: CustomRequestConfig,
  ): Promise<T | null> {
    return this.call(ApiMethodTypes.PATCH, path, requestParams, requestConfig);
  }

  public async delete<T>(
    path: string,
    requestConfig?: CustomRequestConfig,
  ): Promise<T | null> {
    return this.call(ApiMethodTypes.DELETE, path, undefined, requestConfig);
  }
}
