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
