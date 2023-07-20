import { MAP_CSS_MAPBOX } from './config';
import { getRequirements } from './getRequirements';
import { generateLayers } from './generateLayers';
import { createValueConverters } from './valueConverters';
import type { SimpleLegendStep } from '~core/logical_layers/types/legends';
import type { LayerSpecification } from 'maplibre-gl';

/*
  Parsing style pipeline
  We want to support next mapbox layer types: fill, line, symbol.
  We have mapbox limitation: one type - one layer. So
  1. Every MapCSS property converted to requirements in context of mapbox (using serializable config)
  2. Requirements reduces to few mapBox layers
  3. Layers attaches to sources
*/
export function mapCSSToMapBoxProperties(mapCSSStyle) {
  const requirements = getRequirements(MAP_CSS_MAPBOX, mapCSSStyle);
  const valueConverters = createValueConverters(mapCSSStyle);
  const layers = generateLayers(requirements, valueConverters);
  return layers;
}

export function applyLegendConditions(
  legendStep: SimpleLegendStep,
  /* Layers generated from MapCSS for legend step */
  mapLayers: Omit<LayerSpecification, 'id'>[],
) {
  if (!legendStep.paramName) return mapLayers;
  return mapLayers.map((layer) => {
    return {
      ...layer,
      filter: ['==', ['get', legendStep.paramName], legendStep.paramValue],
    };
  });
}

export function setSourceLayer(
  legendStep: SimpleLegendStep,
  mapLayers: Omit<LayerSpecification, 'id'>[],
) {
  if (!legendStep.sourceLayer) return mapLayers;
  return mapLayers.map((layer) => {
    return {
      ...layer,
      'source-layer': legendStep.sourceLayer,
    };
  });
}
