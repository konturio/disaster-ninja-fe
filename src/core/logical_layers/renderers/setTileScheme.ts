import type { RasterSource, VectorSource } from 'maplibre-gl';

/* https://docs.mapbox.com/mapbox-gl-js/style-spec/sources/#vector-scheme */
export function setTileScheme(rawUrl: string, mapSource: VectorSource | RasterSource) {
  const isTMS = rawUrl.includes('{-y}');
  if (isTMS) {
    mapSource.scheme = 'tms';
  }
}
