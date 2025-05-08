import { multivariateDimensionToScore } from '../../stylesConfigs/multivariate/multivariateDimensionToScore';
import { SOURCE_LAYER_MCDA } from '../../stylesConfigs/mcda/constants';
import { formatFeatureText } from './formatFeatureText';
import type {
  ExpressionSpecification,
  FilterSpecification,
  LayerSpecification,
} from 'maplibre-gl';
import type { TextDimension } from '../types';

export function createTextLayerSpecification(
  textDimension: TextDimension,
  textLayerId: string,
  sourceId: string,
  filter?: FilterSpecification,
): LayerSpecification {
  let value: ExpressionSpecification | undefined = undefined;
  let formattedValue: ExpressionSpecification | undefined = undefined;
  if (textDimension?.valueExpression) {
    value = textDimension?.valueExpression;
  }
  if (textDimension?.mcda) {
    value = multivariateDimensionToScore(textDimension?.mcda) as ExpressionSpecification;
  }
  if (value) {
    if (textDimension?.precision !== undefined) {
      if (textDimension.precision === 0) {
        value = ['round', value];
      } else if (textDimension.precision > 0) {
        const precisionMultiplier = Math.pow(10, textDimension.precision);
        value = ['/', ['round', ['*', value, precisionMultiplier]], precisionMultiplier];
      }
    }
    if (textDimension.formatString) {
      formattedValue = formatFeatureText(textDimension.formatString, value);
    }
  }
  const sortExpression: ExpressionSpecification | undefined = value
    ? ['*', ['to-number', value], -1]
    : undefined;
  const layerStyle: LayerSpecification = {
    id: textLayerId,
    type: 'symbol',
    layout: {
      'text-field': formattedValue ?? value,
      'text-font': ['literal', ['Noto Sans Regular']],
      'text-size': 11,
      'symbol-sort-key': sortExpression,
      'symbol-z-order': 'source',
      ...textDimension.layoutOverrides,
    },
    paint: {
      ...textDimension.paintOverrides,
    },
    source: sourceId,
    'source-layer': SOURCE_LAYER_MCDA,
    filter,
  };
  return layerStyle;
}
