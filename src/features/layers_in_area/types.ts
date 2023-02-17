import type { LayerDetailsLegend } from '~core/logical_layers/types/legends';

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
  boundaryRequiredForRetrieval: boolean;
  eventIdRequiredForRetrieval?: boolean;
  ownedByUser: boolean;
}

export interface GeoJSONSourceSourceContainer {
  id: string;
  source: GeoJSONSource;
  legend: LayerDetailsLegend;
}

export interface TileSourceContainer {
  id: string;
  maxZoom: number;
  minZoom: number;
  source: TileSource;
  legend?: LayerDetailsLegend;
}

export interface MinimalResponse {
  id: string;
  ownedByUser: boolean;
}

export type LayerInAreaDetails =
  | GeoJSONSourceSourceContainer
  | TileSourceContainer
  | MinimalResponse;
