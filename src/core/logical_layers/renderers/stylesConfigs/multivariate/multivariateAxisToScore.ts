import { linearNormalization } from '../mcda/mcdaStyle';
import type { MultivariateAxis } from '../../MultivariateRenderer/types';

export function multivariateAxisToScore(axis: MultivariateAxis) {
  return linearNormalization(axis.config.layers);
}
