import { linearNormalization } from '../mcda/mcdaStyle';
import type { MultivariateDimension } from '../../MultivariateRenderer/types';

export function multivariateDimensionToScore(axis: MultivariateDimension) {
  return linearNormalization(axis.config.layers);
}
