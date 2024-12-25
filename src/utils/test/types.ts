/**
 * Common API error kinds that can be used across tests
 */
export type ApiErrorKind =
  | 'unauthorized'
  | 'forbidden'
  | 'not-found'
  | 'timeout'
  | 'cannot-connect'
  | 'server'
  | 'client-unknown'
  | 'bad-data';

/**
 * Standard API error response shape
 */
export interface ApiErrorResponse {
  kind: ApiErrorKind;
  message: string;
  data?: any;
  temporary?: boolean;
}

/**
 * Common HTTP methods used in tests
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

/**
 * Options for setting up API responses in tests
 */
export interface ApiResponseOptions {
  method?: HttpMethod;
  headers?: Record<string, string>;
  once?: boolean;
}
