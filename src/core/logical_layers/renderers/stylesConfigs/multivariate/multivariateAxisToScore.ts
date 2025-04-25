import { linearNormalization } from '../mcda/mcdaStyle';
import type { MultivariateAxis } from '../../MultivariateRenderer/types';

export function multivariateAxisToScore(axis: MultivariateAxis | number) {
  if (typeof axis === 'number') {
    return axis;
  } else {
    return linearNormalization(axis.config.layers);
  }
}
