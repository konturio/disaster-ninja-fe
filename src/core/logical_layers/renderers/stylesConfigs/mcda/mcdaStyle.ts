import { adaptTileUrl } from '~utils/bivariate/tile/adaptTileUrl';
import appConfig from '~core/app_config';
import {
  anyCondition,
  featureProp,
  notEqual,
} from '~utils/bivariate/bivariate_style/styleGen';
import { sumBy } from '~utils/common';
import { DEFAULT_GREEN, DEFAULT_RED } from './calculations/constants';
import { calculateLayerPipeline, inStyleCalculations } from './calculations';
import type { MCDAConfig } from './types';

//@ts-expect-error - not clear how to type this right, but this compromise do the trick
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

type PaintProps = {
  colorsConfig: MCDAConfig['colors'];
  mcdaResult: number | (string | number | (string | number)[])[];
  absoluteMax: number;
  absoluteMin: number;
};

function sentimentPaint({
  colorsConfig,
  mcdaResult,
  absoluteMin,
  absoluteMax,
}: PaintProps) {
  const { good = DEFAULT_GREEN, bad = DEFAULT_RED } = colorsConfig.parameters;
  return {
    'fill-color': [
      'let',
      'mcdaResult',
      ['to-number', mcdaResult, -9999], // falsy values become -9999
      [
        'case',
        [
          'all',
          ['>=', ['var', 'mcdaResult'], absoluteMin],
          ['<=', ['var', 'mcdaResult'], absoluteMax],
        ],
        ['interpolate-hcl', ['linear'], ['var', 'mcdaResult'], 0, bad, 1, good],
        'transparent', // all values outside of range [0,1] will be painted as transparent
      ],
    ],
    'fill-opacity': 1,
    'fill-antialias': false,
  };
}

function expressionsPaint({
  colorsConfig,
  mcdaResult,
  absoluteMax,
  absoluteMin,
}: PaintProps) {
  return Object.entries(colorsConfig.parameters).reduce(
    (acc, [paintProp, expression]) => {
      acc[paintProp] = Array.isArray(expression)
        ? [
            'let',
            'mcdaResult',
            ['to-number', mcdaResult, -9999], // falsy values become -9999,
            'absoluteMax',
            ['to-number', absoluteMax, -9999], // falsy values become -9999,
            'absoluteMin',
            ['to-number', absoluteMin, -9999], // falsy values become -9999,
            ...expression,
          ]
        : expression;

      return acc;
    },
    {} as Record<any, any>,
  );
}

function generateLayerPaint(props: PaintProps) {
  switch (props.colorsConfig.type) {
    case 'sentiments':
      return sentimentPaint(props);

    case 'mapLibreExpression':
      return expressionsPaint(props);
  }
}

export function createMCDAStyle(config: MCDAConfig) {
  const [absoluteMin = 0, absoluteMax = 1] = config.layers.reduce((acc, l) => {
    // Show full range of values between min max if normalization not enabled
    const range: [number, number] = l.normalization === 'no' ? l.range : [0, 1];
    if (acc.length === 0) return range;
    acc[0] = Math.min(acc[0], range[0]);
    acc[1] = Math.min(acc[1], range[1]);
    return acc;
  }, [] as [number, number] | []);

  const mcdaResult = linearNormalization(config.layers);

  const layerStyle = {
    id: config.id,
    type: 'fill' as const,
    layout: {},
    filter: filterSetup(config.layers),
    // TODO - MCDA should have separate from bivariate renderer
    paint: generateLayerPaint({
      colorsConfig: config.colors,
      mcdaResult,
      absoluteMin,
      absoluteMax,
    }),

    source: {
      type: 'vector' as const,
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
