import type { LayerDetailsLegend } from '~core/logical_layers/types/legends';

export interface TileSource {
  type: 'vector' | 'raster';
  tileSize: number;
  urls: string[];
  apiKey?: string;
}

export interface GeoJSONSource {
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

export interface GeoJSONSourceSourceContainer {
  id: string;
  source: GeoJSONSource;
  legend: LayerDetailsLegend;
  ownedByUser: boolean;
}

export interface TileSourceContainer {
  id: string;
  maxZoom: number;
  minZoom: number;
  source: TileSource;
  legend?: LayerDetailsLegend;
  ownedByUser: boolean;
}
export type LayerDetailsDTO = GeoJSONSourceSourceContainer | TileSourceContainer;

export interface LayerSummaryDto {
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
