import {
  addVariable,
  anyCondition,
  classResolver,
  colorResolver,
  featureProp,
  notEqual,
} from './styleGen';
import type { ExpressionSpecification, FilterSpecification } from 'maplibre-gl';
import type { Stat, Axis, OverlayColor } from '../types/stat.types';
import type { BivariateLayerStyle } from '~utils/bivariate/bivariateColorThemeUtils';

export function colorsMap(colors: Array<OverlayColor>): Record<string, string> {
  return Object.fromEntries(colors.map(({ id, color }) => [id, color]));
}

function filterSetup(xAxis: Axis, yAxis: Axis): FilterSpecification {
  return anyCondition(
    notEqual(['/', featureProp(xAxis.quotient[0]), featureProp(xAxis.quotient[1])], 0),
    notEqual(['/', featureProp(yAxis.quotient[0]), featureProp(yAxis.quotient[1])], 0),
  );
}

function colorSetup(xAxis: Axis, yAxis: Axis, colors: Record<string, string>) {
  const xAxisProp: ExpressionSpecification = [
    '/',
    featureProp(xAxis.quotient[0]),
    featureProp(xAxis.quotient[1]),
  ];
  const yAxisProp: ExpressionSpecification = [
    '/',
    featureProp(yAxis.quotient[0]),
    featureProp(yAxis.quotient[1]),
  ];

  return addVariable(
    'class',
    classResolver(
      {
        propName: xAxisProp,
        borders: xAxis.steps.reduce<number[]>(
          (acc, { value }) => (acc.push(value), acc),
          [],
        ),
      },
      {
        propName: yAxisProp,
        borders: yAxis.steps.reduce<number[]>(
          (acc, { value }) => (acc.push(value), acc),
          [],
        ),
      },
    ),
    colorResolver('class', colors, 'transparent'),
  );
}

export interface StyleGeneratorProps {
  x: Stat['axis'][0];
  y: Stat['axis'][0];
  colors: OverlayColor[];
  id?: string;
  source?: string | any; // TODO: take typings from mapbox
  sourceLayer?: string;
}

export function generateBivariateStyleForAxis({
  x,
  y,
  colors,
  source,
  sourceLayer,
  id = 'bivariate',
}: StyleGeneratorProps): BivariateLayerStyle {
  const style: BivariateLayerStyle = {
    id,
    type: 'fill' as const,
    layout: {},
    filter: filterSetup(x, y),
    paint: {
      'fill-color': colorSetup(x, y, colorsMap(colors)),
      'fill-opacity': 1,
      'fill-antialias': false,
    },
  };

  if (source) {
    style.source = source;
  }

  if (sourceLayer) {
    style['source-layer'] = sourceLayer;
  }

  return style;
}
