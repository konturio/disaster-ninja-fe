import type { LayerGeoJSONSource } from '~core/logical_layers/types/source';

export function createGeoJSONLayerSource(
  id: string,
  data: LayerGeoJSONSource['source']['data'],
): LayerGeoJSONSource {
  return {
    id,
    source: {
      type: 'geojson',
      data,
    },
  };
}
