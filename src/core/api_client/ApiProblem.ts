import { ApiResponse } from 'apisauce';

export type GeneralApiProblem =
  /**
   * Times up.
   */
  | { kind: 'timeout'; temporary: true }
  /**
   * Cannot connect to the server for some reason.
   */
  | { kind: 'cannot-connect'; temporary: true }
  /**
   * The server experienced a problem. Any 5xx error.
   */
  | { kind: 'server'; data?: unknown }
  /**
   * We're not allowed because we haven't identified ourself. This is 401.
   */
  | { kind: 'unauthorized'; data: string }
  /**
   * We don't have access to perform that request. This is 403.
   */
  | { kind: 'forbidden' }
  /**
   * Unable to find that resource.  This is a 404.
   */
  | { kind: 'not-found' }
  /**
   * All other 4xx series errors.
   */
  | { kind: 'rejected'; data: unknown }
  /**
   * Something truly unexpected happened. Most likely can try again. This is a catch all.
   */
  | { kind: 'unknown'; temporary: true }
  /**
   * The data we received is not in the expected format.
   */
  | { kind: 'bad-data' }
  /**
   * We expected to receive data but didn't get it
   */
  | { kind: 'no-data' }
  /**
   * Request canceled by using cancel token.
   */
  | { kind: 'canceled' };

/**
 * Attempts to get a common cause of problems from an api response.
 *
 * @param response The api response.
 */
export function getGeneralApiProblem(response: ApiResponse<GeneralApiProblem>) {
  switch (response.problem) {
    case 'CONNECTION_ERROR':
      return { kind: 'cannot-connect', temporary: true } as const;
    case 'NETWORK_ERROR':
      return { kind: 'cannot-connect', temporary: true } as const;
    case 'TIMEOUT_ERROR':
      return { kind: 'timeout', temporary: true } as const;
    case 'SERVER_ERROR':
      return { kind: 'server', data: response.data } as const;
    case 'UNKNOWN_ERROR':
      return { kind: 'unknown', temporary: true } as const;
    case 'CLIENT_ERROR':
      switch (response.status) {
        case 401:
          return {
            kind: 'unauthorized',
            data: 'Not authorized or session has expired.',
          } as const;
        case 403:
          return { kind: 'forbidden' } as const;
        case 404:
          return { kind: 'not-found' } as const;
        default:
          return { kind: 'rejected', data: response.data } as const;
      }

    case 'CANCEL_ERROR':
      return { kind: 'canceled' } as const;

    default:
      return { kind: 'unknown', temporary: true } as const;
  }
}

export class ApiClientError extends Error {
  public readonly problem: GeneralApiProblem;

  constructor(message: string, problem: GeneralApiProblem) {
    super(message);

    this.problem = problem;

    // need this to pass checks with "error instanceof ApiClientError"
    Object.setPrototypeOf(this, ApiClientError.prototype);
  }
}
