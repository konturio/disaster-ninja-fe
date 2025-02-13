import { bivariate_legend_steps } from './mocks/bivariate_legend_steps';
import { mcda_elevation } from './mocks/mcda_elevation';
import { mcda_population } from './mocks/mcda_population';
import type { MultivariateLayerConfig } from './types';

const multivariate1: MultivariateLayerConfig = {
  version: 0,
  id: 'multivariate1',
  name: 'Multivariate layer 1',
  score: mcda_population,
  base: mcda_elevation,
  strength: 1,
  colors: { type: 'bivariate', colors: bivariate_legend_steps },
};
