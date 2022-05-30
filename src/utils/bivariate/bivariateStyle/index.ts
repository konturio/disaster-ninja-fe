import { Stat, Axis, OverlayColor } from '../types/stat.types';
import {
  addVariable,
  anyCondition,
  classResolver,
  colorResolver,
  featureProp,
  notEqual,
} from './styleGen';

function colorsMap(colors) {
  return Object.fromEntries(colors.map(Object.values));
}

function filterSetup(xAxis: Axis, yAxis: Axis) {
  return anyCondition(
    notEqual(
      ['/', featureProp(xAxis.quotient[0]), featureProp(xAxis.quotient[1])],
      0,
    ),
    notEqual(
      ['/', featureProp(yAxis.quotient[0]), featureProp(yAxis.quotient[1])],
      0,
    ),
  );
}

function colorSetup(xAxis: Axis, yAxis: Axis, colors) {
  return addVariable(
    'class',
    classResolver(
      {
        propName: ['/', ...xAxis.quotient],
        borders: xAxis.steps.reduce<number[]>(
          (acc, { value }) => (acc.push(value), acc),
          [],
        ),
      },
      {
        propName: ['/', ...yAxis.quotient],
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
  source: string | any; // TODO: take typings from mapbox
  sourceLayer?: string;
}

export function generateBivariateStyleForAxis({
  x,
  y,
  colors,
  source,
  sourceLayer,
  id = 'bivariate',
}: StyleGeneratorProps) {
  const style = {
    id,
    type: 'fill' as const,
    source,
    layout: {},
    filter: filterSetup(x, y),
    paint: {
      'fill-color': colorSetup(x, y, colorsMap(colors)),
      'fill-opacity': 1,
      'fill-antialias': false,
    },
  };

  if (sourceLayer) {
    style['source-layer'] = sourceLayer;
  }

  return style;
}
