// temporary place for basemap-related stuff
import type { LayerDetailsDto } from '~core/logical_layers/types/source';
export const MAPBOX_EMPTY_STYLE = { version: 8, sources: {}, layers: [] };
export const BASEMAPS_LIST = ['kontur_lines', 'kontur_zmrok'];
export const BASEMAP_SOURCE_TYPE = 'maplibre-style-url';

export function getBasemapFromDetails(layers: LayerDetailsDto[]) {
  const basemapLayer = layers.find((d) => d.source?.type === BASEMAP_SOURCE_TYPE);
  const basemapLayerUrl = basemapLayer?.source?.urls?.at(0);
  console.assert(basemapLayer, 'No default basemap');
  return {
    basemapLayer,
    basemapLayerId: basemapLayer?.id ?? BASEMAPS_LIST[0],
    basemapLayerUrl,
  };
}

export function findBasemapInLayersList(layers: string[]) {
  for (const basemap of BASEMAPS_LIST) {
    if (layers.includes(basemap)) return basemap;
  }
}
