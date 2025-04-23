import { generateBivariateColorsAndStyleForMultivariateLayer } from '~utils/multivariate/multivariateStyle';
import { SOURCE_LAYER_BIVARIATE } from '../BivariateRenderer/constants';
import { createMCDAStyle, linearNormalization } from './mcda/mcdaStyle';
import { MapMath } from './mcda/calculations/operations';
import type { MultivariateLayerStyle } from './multivariate/multivariateStyle';
import type { MapExpression } from './mcda/calculations/operations';
import type { MultivariateAxis } from '../MultivariateRenderer/types';
import type { MCDALayerStyle } from './mcda/types';
import type { FillLayerSpecification, LayerSpecification } from 'maplibre-gl';
import type { LayerStyle } from '~core/logical_layers/types/style';

export function multivariateAxisToScore(axis: MultivariateAxis | number) {
  if (typeof axis === 'number') {
    return axis;
  } else {
    return linearNormalization(axis.config.layers);
  }
}

export const styleConfigs: Record<
  LayerStyle['type'],
  (config: any) => LayerSpecification[]
> = {
  mcda: (config: MCDALayerStyle['config']): LayerSpecification[] => {
    return new Array(createMCDAStyle(config));
  },
  multivariate: (config: MultivariateLayerStyle['config']) => {
    let multivariateStyle: FillLayerSpecification;

    if (config.base) {
      // if we have both score and base - the layer becomes bivariate
      const colorsAndStyle = generateBivariateColorsAndStyleForMultivariateLayer(
        config,
        SOURCE_LAYER_BIVARIATE,
      );
      multivariateStyle = colorsAndStyle[1];
    } else {
      multivariateStyle = createMCDAStyle(config.score.config);
    }
    if (config.strength) {
      const opacity = new MapMath().clamp(
        multivariateAxisToScore(config.strength) as unknown as MapExpression,
        0.2 as unknown as MapExpression,
        1 as unknown as MapExpression,
      );
      multivariateStyle = {
        ...multivariateStyle,
        paint: { ...multivariateStyle.paint, 'fill-opacity': opacity },
      };
    }
    return Array(multivariateStyle);
  },
};
