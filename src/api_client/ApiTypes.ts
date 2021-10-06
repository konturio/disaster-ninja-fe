import { GeneralApiProblem } from './ApiProblem';

export type LoginRequestResult =
  | {
      kind: 'ok';
      data: {
        accessToken: string;
        refreshToken: string;
      };
    }
  | GeneralApiProblem;

export type GenericRequestResult =
  | {
      kind: 'ok';
      data: any;
    }
  | GeneralApiProblem;
