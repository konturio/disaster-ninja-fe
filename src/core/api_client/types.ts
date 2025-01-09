import type { AuthRequirement } from '~core/auth/constants';

export const ApiMethodTypes = {
  GET: 'get',
  POST: 'post',
  PUT: 'put',
  PATCH: 'patch',
  DELETE: 'delete',
} as const;

export type ApiMethod = (typeof ApiMethodTypes)[keyof typeof ApiMethodTypes];

export interface ApiClientConfig {
  baseUrl?: string;
}

export interface KeycloakAuthResponse {
  access_token: string;
  expires_in: number;
  refresh_expires_in: number;
  refresh_token: string;
  scope: string;
  session_state: string;
  token_type: 'Bearer';
  error_description?: string;
}

export type JWTData = {
  acr: string;
  aud: string;
  azp: string;
  email: string;
  email_verified: boolean;
  exp: number;
  family_name: string;
  given_name: string;
  iat: number;
  iss: string;
  jti: string;
  name: string;
  preferred_username: string;
  realm_access: { roles: string[] };
  resource_access: { account: { roles: string[] } };
  scope: string;
  session_state: string;
  sub: string;
  typ: string;
};

// GeoJSON.GeoJSON conflict with  Record<string, unknown>
// https://stackoverflow.com/questions/60697214/how-to-fix-index-signature-is-missing-in-type-error
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type RequestParams = Record<string, any>;

export type RequestErrorsConfig = {
  hideErrors?: boolean;
  messages?: Record<number, string> | string;
};

/** ----------------------------------------------------------------------------
 *          API PROBLEM
 * -------------------------------------------------------------------------- */

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
   * 400 Bad Request
   */
  | { kind: 'bad-request' }
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
  | { kind: 'canceled' }
  /**
   * Something truly unexpected happened. Most likely can try again. This is a catch all.
   */
  | { kind: 'unknown'; temporary: true }
  /**
   * Client-side catch all
   */
  | { kind: 'client-unknown' };

export interface RetryConfig {
  /** Maximum number of retry attempts. Default: 0 (no retries) */
  attempts: number;
  /** Delay in milliseconds between retries. Default: 1000 */
  delayMs?: number;
  /** Error kinds to retry on. Default: ['timeout'] */
  onErrorKinds?: Array<GeneralApiProblem['kind']>;
}

export interface CustomRequestConfig {
  signal?: AbortSignal;
  headers?: Record<string, string>;
  errorsConfig?: RequestErrorsConfig;
  authRequirement?: AuthRequirement;
  retry?: RetryConfig;
}
