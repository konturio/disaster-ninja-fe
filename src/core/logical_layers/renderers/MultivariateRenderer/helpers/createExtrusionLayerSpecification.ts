import { multivariateDimensionToScore } from '../../stylesConfigs/multivariate/multivariateDimensionToScore';
import { SOURCE_LAYER_MCDA } from '../../stylesConfigs/mcda/constants';
import type {
  ExpressionSpecification,
  FilterSpecification,
  LayerSpecification,
} from 'maplibre-gl';
import type { ExtrusionDimension } from '../types';

export function createExtrusionLayerSpecification(
  extrusionDimension: ExtrusionDimension,
  extrusionLayerId: string,
  sourceId: string,
  mainLayerSpecification: LayerSpecification,
  filter?: FilterSpecification,
  opacity?: number,
): LayerSpecification {
  const minHeight = 0;
  const maxHeight = extrusionDimension.maxHeight ?? 0;
  const mcdaLayers = extrusionDimension.height.config.layers;
  let multiplier = 1;
  // For single non-normalized layer, scale by data range
  // Otherwise, use maxHeight as direct multiplier
  if (
    mcdaLayers.length === 1 &&
    mcdaLayers[0].normalization === 'no' &&
    mcdaLayers[0].range[1] > mcdaLayers[0].range[0]
  ) {
    multiplier =
      (maxHeight - minHeight) / (mcdaLayers[0].range[1] - mcdaLayers[0].range[0]);
  } else {
    multiplier = maxHeight;
  }
  const heightExpression = [
    '*',
    multivariateDimensionToScore(extrusionDimension.height),
    multiplier,
  ] as ExpressionSpecification;
  const extrusionColor = mainLayerSpecification.paint?.['fill-color'];
  const layerSpecification: LayerSpecification = {
    id: extrusionLayerId,
    type: 'fill-extrusion',
    filter: filter,
    layout: {},
    paint: {
      'fill-extrusion-height': heightExpression,
      'fill-extrusion-base': minHeight,
      'fill-extrusion-color': extrusionColor,
      'fill-extrusion-opacity': opacity !== undefined ? opacity : 0.75,
      'fill-extrusion-vertical-gradient': false,
    },
    source: sourceId,
    'source-layer': SOURCE_LAYER_MCDA,
  };
  return layerSpecification;
}
