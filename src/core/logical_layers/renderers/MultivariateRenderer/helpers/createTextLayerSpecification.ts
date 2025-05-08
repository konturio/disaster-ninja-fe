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
): LayerSpecification | undefined {
  let value: ExpressionSpecification[] | undefined = undefined;
  if (textDimension?.expressionValue) {
    value = [textDimension?.expressionValue];
  }
  if (textDimension?.mcdaValue) {
    value = [
      multivariateDimensionToScore(textDimension?.mcdaValue) as ExpressionSpecification,
    ];
  }
  if (value?.length) {
    if (textDimension?.precision !== undefined) {
      if (textDimension.precision === 0) {
        value = value.map((v) => ['round', v]);
      } else if (textDimension.precision > 0) {
        const precisionMultiplier = Math.pow(10, textDimension.precision);
        value = value.map((v) => [
          '/',
          ['round', ['*', v, precisionMultiplier]],
          precisionMultiplier,
        ]);
      }
    }
    const formatString = textDimension.formatString;
    const formattedValue: ExpressionSpecification[] = value.map((v) =>
      formatString ? formatFeatureText(formatString, v) : ['to-string', v],
    );

    let outputLines: ExpressionSpecification;
    if (formattedValue.length > 1) {
      const lines: any[] = [];
      for (let i = 0; i < formattedValue.length; i += 1) {
        lines.push(['to-string', formattedValue[i]]);
        if (i !== formattedValue.length - 1) {
          lines.push('\n');
        }
      }
      outputLines = ['concat', ...lines];
    } else {
      outputLines = formattedValue[0];
    }

    const sortExpression: ExpressionSpecification = ['*', value[0], -1];
    const layerStyle: LayerSpecification = {
      id: textLayerId,
      type: 'symbol',
      layout: {
        'text-field': outputLines,
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
  return undefined;
}
