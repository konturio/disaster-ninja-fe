import {
  allCondition,
  anyCondition,
  featureProp,
  greaterOrEqual,
  lessOrEqual,
  notEqual,
} from '~utils/bivariate/bivariate_style/styleGen';
import { sumBy } from '~utils/common';
import { DEFAULT_GREEN, DEFAULT_RED } from './calculations/constants';
import { calculateLayerPipeline, inStyleCalculations } from './calculations';
import { SOURCE_LAYER_MCDA } from './constants';
import type {
  ExpressionSpecification,
  FillLayerSpecification,
  FilterSpecification,
} from 'maplibre-gl';
import type { ColorsByMapLibreExpression, MCDAConfig } from './types';

//@ts-expect-error - not clear how to type this right, but this compromise do the trick
const calculateLayer = calculateLayerPipeline(inStyleCalculations, (axis) => ({
  num: ['get', axis.num],
  den: ['get', axis.den],
}));

export function filterSetup(layers: MCDAConfig['layers']): FilterSpecification {
  // TODO: is this condition really needed?
  // checks that at least one layer has a non-zero value
  const conditions = [
    anyCondition(
      ...layers.map(({ axis }) =>
        notEqual(['/', featureProp(axis[0]), featureProp(axis[1])], 0),
      ),
    ),
  ];
  // checks that all of the layers with outliers=="hide" are within their ranges
  layers.forEach(({ axis, range, outliers }) => {
    if (outliers === 'hide') {
      conditions.push(
        greaterOrEqual(['/', featureProp(axis[0]), featureProp(axis[1])], range[0]),
        lessOrEqual(['/', featureProp(axis[0]), featureProp(axis[1])], range[1]),
      );
    }
  });
  layers.forEach(({ axis, range }) => {
    conditions.push(
      // this checks for 0 in denominator (0 in denominator makes the result === Infinity)
      notEqual(featureProp(axis[1]), 0),
    );
  });
  if (conditions.length > 1) {
    return allCondition(...conditions);
  }
  return conditions[0];
}

export function linearNormalization(
  layers: MCDAConfig['layers'],
): ExpressionSpecification {
  if (layers.length === 1) {
    return ['/', calculateLayer(layers.at(0)!), layers.at(0)!.coefficient];
  } else {
    return ['/', ['+', ...layers.map(calculateLayer)], sumBy(layers, 'coefficient')];
  }
}

type PaintProps = {
  colorsConfig: MCDAConfig['colors'];
  mcdaResult: ExpressionSpecification;
  absoluteMax: number;
  absoluteMin: number;
};

function sentimentPaint({
  colorsConfig,
  mcdaResult,
  absoluteMin,
  absoluteMax,
}: PaintProps): FillLayerSpecification['paint'] {
  if (colorsConfig.type !== 'sentiments') {
    console.error(`Expected sentiments color config, but got ${colorsConfig.type}`);
    return undefined;
  }
  const { good = DEFAULT_GREEN, bad = DEFAULT_RED } = colorsConfig.parameters;
  /* TODO: using midpoints for gradient customization is a temporary solution.
  It will probably be removed in the future in favor of working with Color Manager */
  const midpoints = Array.isArray(colorsConfig.parameters.midpoints)
    ? colorsConfig.parameters.midpoints
    : [];
  const colorPoints = [
    { value: absoluteMin, color: bad },
    ...midpoints,
    { value: absoluteMax, color: good },
  ];
  return {
    'fill-color': [
      'let',
      'mcdaResult',
      mcdaResult,
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
          ...colorPoints.flatMap((point) => [point.value, point.color]),
        ],
        // paint all values below absoluteMin (0 by default) same as absoluteMin
        ['<', ['var', 'mcdaResult'], absoluteMin],
        bad,
        // paint all values above absoluteMax (1 by default) same as absoluteMax
        ['>', ['var', 'mcdaResult'], absoluteMax],
        good,
        // Default color value. We get here in case of incorrect values (null, NaN etc)
        // Transparent features don't show popups on click
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
}: PaintProps): FillLayerSpecification['paint'] {
  return Object.entries((colorsConfig as ColorsByMapLibreExpression).parameters).reduce(
    (acc, [paintProp, expression]) => {
      acc![paintProp] = Array.isArray(expression)
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
    {} as FillLayerSpecification['paint'],
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

export function createMCDAStyle(config: MCDAConfig): FillLayerSpecification {
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

  const layerStyle: FillLayerSpecification = {
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

    source: config.id + '_source',
    'source-layer': SOURCE_LAYER_MCDA,
  };

  return layerStyle;
}
