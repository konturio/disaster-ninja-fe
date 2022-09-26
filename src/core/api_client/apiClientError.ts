import type { GeneralApiProblem } from './types';

export class ApiClientError extends Error {
  public readonly problem: GeneralApiProblem;

  constructor(message: string, problem: GeneralApiProblem) {
    super(message);

    this.problem = problem;

    // need this to pass checks with "error instanceof ApiClientError"
    Object.setPrototypeOf(this, ApiClientError.prototype);
  }
}

export function isApiError(x: any): x is ApiClientError {
  if (x.problem) return typeof x.problem === 'object';
  return false;
}

export function getApiErrorKind(x: any) {
  if (isApiError(x)) {
    return x.problem.kind;
  }
  return null;
}

export function getApiErrorMessage(x: any) {
  if (isApiError(x)) {
    return x.message;
  }
  return null;
}
