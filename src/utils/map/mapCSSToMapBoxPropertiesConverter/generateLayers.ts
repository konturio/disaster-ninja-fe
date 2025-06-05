import type {
  FilterSpecification,
  LayerSpecification,
  LineLayerSpecification,
} from 'maplibre-gl';

interface CasingLineLayer extends Omit<LineLayerSpecification, 'type'> {
  type: 'casing_line';
  paint: Record<string, string | number>;
}
type LayerSpecificationWithoutId = Omit<LayerSpecification | CasingLineLayer, 'id'>;

const filters = {
  fill: ['==', '$type', 'Polygon'] as FilterSpecification,
  symbol: ['==', '$type', 'Point'] as FilterSpecification,
};

export function generateLayers(
  requirements,
  valueConverters,
): Omit<LayerSpecification, 'id'>[] {
  const layersByType: Record<string, LayerSpecificationWithoutId> = {};
  requirements.forEach(([req, value]) => {
    /**
     * One mapCSS property can require array of mapbox properties,
     * But in case required only one property - array can be omitted
     */
    /* Convert to array if omitted */
    if (!Array.isArray(req)) req = [req];

    req.forEach((r) => {
      if (r === null) return; // property not have any requirements
      /* Create layer for type if not created yet */
      if (layersByType[r.type] === undefined) {
        layersByType[r.type] = { type: r.type };
        if (filters[r.type]) {
          layersByType[r.type]['filter'] = filters[r.type];
        }
      }

      /* Create layer category if not not created yet */
      if (layersByType[r.type][r.category] === undefined) {
        layersByType[r.type][r.category] = {};
      }

      /* Apply value transformer */
      const preparedValue = r.valueConverter
        ? valueConverters[r.valueConverter](value)
        : value;

      /* Insert property and value to layer */
      layersByType[r.type][r.category][r.name] = preparedValue;
    });
  });

  return Object.values(layersByType)
    .map((layer: LayerSpecificationWithoutId): Omit<LayerSpecification, 'id'> => {
      layer.type = layer.type === 'casing_line' ? 'line' : layer.type;
      return layer as Omit<LayerSpecification, 'id'>;
    })
    .filter((l) => {
      const isUnnecessaryLayer =
        // @ts-expect-error - FIXME
        l.type === 'line' && Object.keys(l.paint).length === 1;
      return !isUnnecessaryLayer;
    });
}
