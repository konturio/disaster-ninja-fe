import { multivariateAxisToScore } from './multivariateAxisToScore';
import type { MCDALayerStyle } from '../mcda/types';
import type { MapExpression } from '../mcda/calculations/operations';

export function getOpacityExpression(opacity: MCDALayerStyle | number): MapExpression {
  const opacityScore = multivariateAxisToScore(opacity) as unknown as MapExpression;
  return ['case', ['>=', opacityScore, 0.66], 1, ['>=', opacityScore, 0.33], 0.55, 0.1];
}
