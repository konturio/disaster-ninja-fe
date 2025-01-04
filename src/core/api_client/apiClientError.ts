import type { GeneralApiProblem } from './types';

export class ApiClientError extends Error {
  public readonly problem: GeneralApiProblem;
  status = 0;
  constructor(message: string, problem: GeneralApiProblem, status = 0) {
    super(message);

    this.problem = problem;
    this.status = status;
    // need this to pass checks with "error instanceof ApiClientError"
    Object.setPrototypeOf(this, ApiClientError.prototype);
  }
}

export function isApiError(error: unknown): error is ApiClientError {
  return error instanceof ApiClientError;
}

export function getApiErrorKind(error: unknown) {
  return isApiError(error) ? error.problem.kind : null;
}

export function getApiErrorMessage(error: unknown) {
  return isApiError(error) ? error.message : null;
}
