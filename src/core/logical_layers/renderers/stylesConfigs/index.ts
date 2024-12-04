import { createMCDAStyle, linearNormalization } from './mcda/mcdaStyle';
import type { MCDALayerStyle, MultivariateLayerStyle } from './mcda/types';

export const styleConfigs = {
  mcda: (config: MCDALayerStyle['config']) => {
    return new Array(createMCDAStyle(config));
  },
  multivariate: (config: MultivariateLayerStyle['config']) => {
    let baseStyle = createMCDAStyle(config.base.config);
    if (config.strength) {
      let opacity: unknown;
      if (typeof config.strength === 'number') {
        opacity = config.strength;
      } else {
        opacity = linearNormalization(config.strength.config.layers);
      }
      baseStyle = {
        ...baseStyle,
        paint: { ...baseStyle.paint, 'fill-opacity': opacity },
      };
    }
    return baseStyle;
  },
};
