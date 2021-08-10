import { GeneralApiProblem } from '@services/api/apiProblem';
import { Stat } from '@k2-packages/bivariate-tools';

export type GetStatisticsType =
  | { kind: 'ok'; data: Partial<Stat> }
  | GeneralApiProblem;
