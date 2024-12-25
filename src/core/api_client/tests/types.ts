import type { ApiMethod, GeneralApiProblem } from '../types';

/**
 * Standard API error response shape for API client tests
 */
export type ApiErrorResponse = GeneralApiProblem & {
  message: string;
  data?: unknown;
};

/**
 * Options for setting up API responses in API client tests
 */
export interface ApiResponseOptions {
  method?: ApiMethod;
  headers?: Record<string, string>;
  once?: boolean;
}
