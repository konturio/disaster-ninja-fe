import { GeneralApiProblem } from '~services/api/apiProblem';
import { Disaster } from '~appModule/types';
import { Stat } from '@k2-packages/bivariate-tools';

export type GetStatisticsType =
  | { kind: 'ok'; data: Partial<Stat> }
  | GeneralApiProblem;

export type GetDisastersList =
  | { kind: 'ok'; data: Disaster[] }
  | GeneralApiProblem;
