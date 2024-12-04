import { createMCDAStyle, linearNormalization } from './mcda/mcdaStyle';
import { MapMath } from './mcda/calculations/operations';
import type { MapExpression } from './mcda/calculations/operations';
import type { MultivariateAxis } from '../MultivariateRenderer/types';
import type { MCDALayerStyle, MultivariateLayerStyle } from './mcda/types';

export function multivariateAxisToScore(axis: MultivariateAxis | number) {
  if (typeof axis === 'number') {
    return axis;
  } else {
    return linearNormalization(axis.config.layers);
  }
}

export const styleConfigs = {
  mcda: (config: MCDALayerStyle['config']) => {
    return new Array(createMCDAStyle(config));
  },
  multivariate: (config: MultivariateLayerStyle['config']) => {
    let baseStyle = createMCDAStyle(config.base.config);
    if (config.strength) {
      const opacity = new MapMath().clamp(
        multivariateAxisToScore(config.strength) as unknown as MapExpression,
        0.2 as unknown as MapExpression,
        1 as unknown as MapExpression,
      );
      baseStyle = {
        ...baseStyle,
        paint: { ...baseStyle.paint, 'fill-opacity': opacity },
      };
    }
    return baseStyle;
  },
};
