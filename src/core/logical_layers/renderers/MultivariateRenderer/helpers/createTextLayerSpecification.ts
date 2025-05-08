import { multivariateDimensionToScore } from '../../stylesConfigs/multivariate/multivariateDimensionToScore';
import { SOURCE_LAYER_MCDA } from '../../stylesConfigs/mcda/constants';
import { calculateMCDALayer } from '../../stylesConfigs/mcda/mcdaStyle';
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
  let values: ExpressionSpecification[] | undefined = undefined;
  let units: string[] | undefined = undefined;
  if (textDimension?.expressionValue) {
    values = [textDimension?.expressionValue];
  }
  if (textDimension?.mcdaValue) {
    if (textDimension.mcdaMode === 'score') {
      values = [
        multivariateDimensionToScore(textDimension?.mcdaValue) as ExpressionSpecification,
      ];
    } else {
      // @ts-expect-error - typing for calculateMCDALayer needs fixing, it actually returns ExpressionSpecification
      values = textDimension.mcdaValue.config.layers.map((layer) =>
        calculateMCDALayer(layer),
      );
      units = textDimension.mcdaValue.config.layers.map((layer) => layer.unit ?? '');
    }
  }
  if (values?.length) {
    if (textDimension?.precision !== undefined) {
      if (textDimension.precision === 0) {
        values = values.map((v) => ['round', v]);
      } else if (textDimension.precision > 0) {
        const precisionMultiplier = Math.pow(10, textDimension.precision);
        values = values.map((v) => [
          '/',
          ['round', ['*', v, precisionMultiplier]],
          precisionMultiplier,
        ]);
      }
    }
    const formatString = textDimension.formatString;
    const formattedValues: ExpressionSpecification[] = values.map((v, index) =>
      formatFeatureText(v, formatString, units?.at(index)),
    );

    let outputLines: ExpressionSpecification;
    if (formattedValues.length > 1) {
      const lines: any[] = [];
      for (let i = 0; i < formattedValues.length; i += 1) {
        lines.push(['to-string', formattedValues[i]]);
        if (i !== formattedValues.length - 1) {
          lines.push('\n');
        }
      }
      outputLines = ['concat', ...lines];
    } else {
      outputLines = formattedValues[0];
    }

    const sortExpression: ExpressionSpecification = ['*', values[0], -1];
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
