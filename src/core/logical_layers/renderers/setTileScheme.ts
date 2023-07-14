import type { RasterSourceSpecification, VectorSourceSpecification } from 'maplibre-gl';

/* https://docs.mapbox.com/mapbox-gl-js/style-spec/sources/#vector-scheme */
export function setTileScheme(
  rawUrl: string,
  mapSource: VectorSourceSpecification | RasterSourceSpecification,
) {
  const isTMS = rawUrl.includes('{-y}');
  if (isTMS) {
    mapSource.scheme = 'tms';
  }
}
