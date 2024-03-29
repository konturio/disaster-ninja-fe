import type { LayerSpecification, LineLayerSpecification } from 'maplibre-gl';

interface CasingLineLayer extends Omit<LineLayerSpecification, 'type'> {
  type: 'casing_line';
  paint: Record<string, string | number>;
}
type LayerSpecificationWithoutId = Omit<LayerSpecification | CasingLineLayer, 'id'>;

export function generateLayers(
  requirements,
  valueConverters,
): Omit<LayerSpecification, 'id'>[] {
  const layersByType: Record<
    string,
    Omit<LayerSpecification | CasingLineLayer, 'id'>
  > = {};
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
    .map(
      (
        layer: Omit<LayerSpecification | CasingLineLayer, 'id'>,
      ): Omit<LayerSpecification, 'id'> => {
        layer.type = layer.type === 'casing_line' ? 'line' : layer.type;
        return layer as Omit<LayerSpecification, 'id'>;
      },
    )
    .filter((l) => {
      const isUnnecessaryLayer =
        // @ts-expect-error - FIXME
        l.type === 'line' && Object.keys(l.paint).length === 1;
      return !isUnnecessaryLayer;
    });
}
