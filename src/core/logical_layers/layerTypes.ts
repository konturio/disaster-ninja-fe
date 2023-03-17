import type { LayerDetailsDto, LayerSummaryDto } from './types/source';

export const SUPPORTED_LAYER_TYPE = {
  //rasters - supported by FE
  'raster-xyz': true, // xyz -  y goes down
  'raster-tms': true, // tms - y goes up
  'raster-quadkey': true, // quadkey - bing
  'raster-wms': true, // wms
  'raster-dem': true, // dem tiles
  //vector
  'vector-mvt': true, // mvt
  'vector-geojson-url': true,
  'vector-geojson': true, // geojson
  //maplibre-style
  'maplibre-style-url': true, // - planned to support - basemap type
  'maplibre-style': true, // - (embedded in response)
  //legend:
  // simple legend
  // bivariate legend
  // (mcda legend)
};

export function isLayerSupported(layer: LayerSummaryDto) {
  // FIXME: remove when BE will be returning correct type
  if (layer.type && ['scanex', 'wms_endpoint', 'wmts'].includes(layer.type)) {
    return false;
  } else {
    return true;
  }

  //// correct detection
  // if (layer.type) {
  //   return SUPPORTED_LAYER_TYPE[layer.type];
  // }

  // HACK: type for BIV layers should be provided by BE
  if (layer?.group === 'bivariate') {
    return true;
  }
  return false;
}

export function filterUnsupportedLayerTypes(layers: LayerSummaryDto[]) {
  return layers.filter(isLayerSupported);
}
