import type { ApiMethod, GeneralApiProblem } from '../types';

/**
 * Standard API error response shape for API client tests
 */
export type MockApiErrorResponse = GeneralApiProblem & {
  message: string;
  data?: unknown;
};

/**
 * Options for setting up API responses in API client tests
 */
export interface MockApiResponseOptions {
  method?: ApiMethod;
  headers?: Record<string, string>;
  once?: boolean;
}
