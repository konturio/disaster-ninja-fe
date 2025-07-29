import { generateBivariateColorsAndStyleForMultivariateLayer } from '~utils/multivariate/multivariateStyle';
import { isNumber } from '~utils/common';
import { SOURCE_LAYER_BIVARIATE } from '../BivariateRenderer/constants';
import { createMCDAStyle, filterSetup as mcdaFilterSetup } from './mcda/mcdaStyle';
import { createOpacityStepsExpression } from './multivariate/createOpacityStepsExpression';
import { createMonochromeFillSpec } from './multivariate/createMonochromeFillSpec';
import { SOURCE_LAYER_MCDA } from './mcda/constants';
import { DEFAULT_GREY_FILL_COLOR, TRANSPARENT_COLOR } from './constants';
import type { MultivariateLayerStyle } from './multivariate/multivariateStyle';
import type { MCDAConfig, MCDALayerStyle } from './mcda/types';
import type { FillLayerSpecification, LayerSpecification } from 'maplibre-gl';
import type { LayerStyle } from '~core/logical_layers/types/style';

export const styleConfigs: Record<
  LayerStyle['type'],
  (config: any) => LayerSpecification[]
> = {
  mcda: (config: MCDALayerStyle['config']): LayerSpecification[] => {
    return new Array(createMCDAStyle(config));
  },
  multivariate: (config: MultivariateLayerStyle['config']) => {
    let multivariateStyle: FillLayerSpecification;
    if (config.score && config.base) {
      // if we have both score and base dimension - use bivariate colors
      const colorsAndStyle = generateBivariateColorsAndStyleForMultivariateLayer(
        config,
        SOURCE_LAYER_BIVARIATE,
      );
      multivariateStyle = colorsAndStyle[1];
    } else if (config.score?.config?.layers.length) {
      // create MCDA colors based on Score dimension
      multivariateStyle = createMCDAStyle(config.score.config);
    } else if (config.base?.config?.layers.length) {
      // create MCDA colors based on base (Compare) dimension
      multivariateStyle = createMCDAStyle(config.base.config);
    } else {
      // No color dimensions - create monochrome fill
      const layersForFilter: MCDAConfig['layers'] = [];
      // create filter based on all MCDA layers from opacity and extrusion
      if (typeof config.opacity === 'object' && config.opacity?.config.layers.length) {
        layersForFilter.push(...config.opacity.config.layers);
      }
      if (config.extrusion?.height.config.layers.length) {
        layersForFilter.push(...config.extrusion.height.config.layers);
      }
      // monochrome fill specification
      multivariateStyle = createMonochromeFillSpec(
        mcdaFilterSetup(layersForFilter),
        // grey fill if there's opacity or extrusion dimensions. Transparent fill otherwise
        layersForFilter.length > 0 ? DEFAULT_GREY_FILL_COLOR : TRANSPARENT_COLOR,
        SOURCE_LAYER_MCDA,
      );
    }
    if (config.opacity !== undefined) {
      // apply opacity to fill layers
      const opacity = !isNumber(config.opacity)
        ? createOpacityStepsExpression(config.opacity)
        : config.opacity;
      multivariateStyle = {
        ...multivariateStyle,
        paint: { ...multivariateStyle.paint, 'fill-opacity': opacity },
      };
    }
    return Array(multivariateStyle);
  },
};
