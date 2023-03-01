import sumBy from 'lodash-es/sumBy';
import { adaptTileUrl } from '~utils/bivariate/tile/adaptTileUrl';
import appConfig from '~core/app_config';
import {
  anyCondition,
  featureProp,
  notEqual,
} from '~utils/bivariate/bivariate_style/styleGen';
import { DEFAULT_GREEN, DEFAULT_RED } from '../../calculations/constants';
import { calculateLayerPipeline, inStyleCalculations } from '../../calculations';
import type { BivariateLayerStyle } from '~utils/bivariate/bivariateColorThemeUtils';
import type { MCDAConfig } from '../../types';

const calculateLayer = calculateLayerPipeline(inStyleCalculations, (axis) => ({
  num: ['get', axis.num],
  den: ['get', axis.den],
}));

function filterSetup(layers: MCDAConfig['layers']) {
  return anyCondition(
    ...layers.map(({ axis }) =>
      notEqual(['/', featureProp(axis[0]), featureProp(axis[1])], 0),
    ),
  );
}

export function linearNormalization(layers: MCDAConfig['layers']) {
  const layersCount = layers.length;
  if (layersCount === 1) {
    return calculateLayer(layers.at(0)!);
  } else {
    return ['/', ['+', ...layers.map(calculateLayer)], sumBy(layers, 'coefficient')];
  }
}

export function createMCDAStyle(config: MCDAConfig) {
  const { good = DEFAULT_GREEN, bad = DEFAULT_RED } = config.colors;
  const layerStyle: BivariateLayerStyle = {
    id: config.id,
    type: 'fill',
    layout: {},
    filter: filterSetup(config.layers),
    paint: {
      'fill-color': [
        'let',
        'mcdaResult',
        ['to-number', linearNormalization(config.layers), -1], // falsy values become -1
        [
          'case',
          ['all', ['>=', ['var', 'mcdaResult'], 0], ['<=', ['var', 'mcdaResult'], 1]],
          ['interpolate-hcl', ['linear'], ['var', 'mcdaResult'], 0, bad, 1, good],
          'transparent', // all values outside of range [0,1] will be painted as transparent
        ],
      ],
      'fill-opacity': 1,
      'fill-antialias': false,
    },

    source: {
      type: 'vector',
      tiles: [
        `${adaptTileUrl(
          appConfig.bivariateTilesRelativeUrl,
        )}{z}/{x}/{y}.mvt?indicatorsClass=${appConfig.bivariateTilesIndicatorsClass}`,
      ],
      maxzoom: 8,
      minzoom: 0,
    },
    'source-layer': 'stats',
  };

  return layerStyle;
}
