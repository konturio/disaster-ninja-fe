import { adaptTileUrl } from '~utils/bivariate/tile/adaptTileUrl';
import { configRepo } from '~core/config';
import {
  allCondition,
  anyCondition,
  featureProp,
  greaterOrEqual,
  less,
  lessOrEqual,
  notEqual,
} from '~utils/bivariate/bivariate_style/styleGen';
import { sumBy } from '~utils/common';
import {
  FALLBACK_BIVARIATE_MAX_ZOOM,
  FALLBACK_BIVARIATE_MIN_ZOOM,
} from '../../BivariateRenderer/constants';
import { DEFAULT_GREEN, DEFAULT_RED } from './calculations/constants';
import { calculateLayerPipeline, inStyleCalculations } from './calculations';
import { SOURCE_LAYER_MCDA } from './constants';
import type { MCDAConfig } from './types';

//@ts-expect-error - not clear how to type this right, but this compromise do the trick
const calculateLayer = calculateLayerPipeline(inStyleCalculations, (axis) => ({
  num: ['get', axis.num],
  den: ['get', axis.den],
}));

function filterSetup(layers: MCDAConfig['layers']) {
  // checks that at least one layer has a non-zero value
  const conditions = [
    anyCondition(
      ...layers.map(({ axis }) =>
        notEqual(['/', featureProp(axis[0]), featureProp(axis[1])], 0),
      ),
    ),
  ];
  // checks that all of the layers with outliers=="exclude" are within their ranges
  layers.forEach(({ axis, range, outliers }) => {
    if (outliers === 'exclude') {
      conditions.push(
        greaterOrEqual(['/', featureProp(axis[0]), featureProp(axis[1])], range[0]),
        lessOrEqual(['/', featureProp(axis[0]), featureProp(axis[1])], range[1]),
      );
    }
  });
  if (conditions.length > 1) {
    return allCondition(...conditions);
  }
  return conditions[0];
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
        [
          'interpolate-hcl',
          ['linear'],
          ['var', 'mcdaResult'],
          absoluteMin,
          bad,
          absoluteMax,
          good,
        ],
        // paint all values below absoluteMin (0 by default) same as absoluteMin
        ['<', ['var', 'mcdaResult'], absoluteMin],
        bad,
        // paint all values above absoluteMax (1 by default) same as absoluteMax
        ['>', ['var', 'mcdaResult'], absoluteMax],
        good,
        // default color value. We shouldn't get it, because all cases are covered
        'transparent',
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
    {} as Record<string, unknown>,
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
  const [absoluteMin = 0, absoluteMax = 1] = config.layers.reduce(
    (acc, l) => {
      // Show full range of values between min max if normalization not enabled
      const range: [number, number] = l.normalization === 'no' ? l.range : [0, 1];
      if (acc.length === 0) return [...range];
      acc[0] = Math.min(acc[0], range[0]);
      acc[1] = Math.min(acc[1], range[1]);
      return acc;
    },
    [] as [number, number] | [],
  );

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
          configRepo.get().bivariateTilesRelativeUrl,
        )}{z}/{x}/{y}.mvt?indicatorsClass=${
          configRepo.get().bivariateTilesIndicatorsClass
        }`,
      ],
      maxzoom: FALLBACK_BIVARIATE_MAX_ZOOM,
      minzoom: FALLBACK_BIVARIATE_MIN_ZOOM,
    },
    'source-layer': SOURCE_LAYER_MCDA,
  };

  return layerStyle;
}
