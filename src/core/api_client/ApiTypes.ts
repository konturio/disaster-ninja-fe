import { GeneralApiProblem } from './ApiProblem';

export interface AuthResponseData {
  accessToken: string;
  refreshToken: string;
}

export type GenericRequestResult<T> =
  | {
      kind: 'ok';
      data?: T;
    }
  | GeneralApiProblem;
