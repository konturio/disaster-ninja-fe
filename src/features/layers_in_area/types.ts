import { LayerLegend } from '~core/logical_layers/types/legends';

export interface TileSource {
  type: 'vector' | 'raster';
  tileSize: number;
  url: string[];
}

export interface GeoJSONSource {
  type: 'geojson';
  data: GeoJSON.FeatureCollection | GeoJSON.Feature;
}

export interface LayerInArea {
  id: string;
  name: string;
  source: TileSource | GeoJSONSource;
  description?: string;
  category?: 'base' | 'overlay';
  group?: string;
  copyrights?: string[];
  legend?: LayerLegend;
  boundaryRequiredForRetrieval: boolean;
  eventIdRequiredForRetrieval?: boolean;
}

export interface LayerDetailsGeoJSONSource {
  id: string;
  source: GeoJSONSource;
}

export interface LayerDetailsTileSource {
  id: string;
  maxZoom: number;
  minZoom: number;
  source: TileSource;
}

export type LayerInAreaDetails =
  | LayerDetailsGeoJSONSource
  | LayerDetailsTileSource;
