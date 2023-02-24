interface TileSource {
  type: 'vector' | 'raster';
  tileSize: number;
  urls: string[];
  apiKey?: string;
}

interface GeoJSONSource {
  type: 'geojson';
  data: GeoJSON.FeatureCollection | GeoJSON.Feature;
}

export interface LayerGeoJSONSource {
  id: string;
  source: GeoJSONSource;
}

export interface LayerTileSource {
  id: string;
  maxZoom: number;
  minZoom: number;
  source: TileSource;
}

export type LayerSource = LayerGeoJSONSource | LayerTileSource;
