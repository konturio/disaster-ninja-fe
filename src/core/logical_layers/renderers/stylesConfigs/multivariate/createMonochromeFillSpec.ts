import type { FillLayerSpecification, FilterSpecification } from 'maplibre-gl';

export function createMonochromeFillSpec(
  filter: FilterSpecification | undefined,
  color: string,
  sourceLayerId: string,
): FillLayerSpecification {
  const layerSpec: FillLayerSpecification = {
    // TODO: this id is useless and gets replaced in renderer. Needs refactoring
    id: 'placeholder_id',
    type: 'fill' as const,
    layout: {},
    paint: { 'fill-color': color, 'fill-antialias': false },
    // TODO: this source id is useless and gets replaced in renderer. Needs refactoring
    source: 'placeholder_source_id',
    'source-layer': sourceLayerId,
  };
  if (filter) {
    layerSpec.filter = filter;
  }
  return layerSpec;
}
