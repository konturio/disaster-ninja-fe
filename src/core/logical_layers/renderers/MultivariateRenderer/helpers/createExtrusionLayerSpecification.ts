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
): LayerSpecification {
  const maxExtrusionValue = [
    '*',
    multivariateDimensionToScore(extrusionDimension.extrusionTop),
    6000,
  ] as ExpressionSpecification;
  const extrusionColor = mainLayerSpecification.paint?.['fill-color'];
  const layerSpecification: LayerSpecification = {
    id: extrusionLayerId,
    type: 'fill-extrusion',
    filter: filter,
    layout: {},
    paint: {
      'fill-extrusion-height': maxExtrusionValue,
      'fill-extrusion-base': 0,
      'fill-extrusion-color': extrusionColor,
      'fill-extrusion-opacity': 0.75,
      'fill-extrusion-vertical-gradient': false,
    },
    source: sourceId,
    'source-layer': SOURCE_LAYER_MCDA,
  };
  return layerSpecification;
}
