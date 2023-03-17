import type { LayerDetailsLegend } from '~core/logical_layers/types/legends';

export interface LayerSourceDto {
  type: 'vector' | 'raster' | 'geojson' | 'maplibre-style-url';
  urls?: string[];
  tileSize?: number;
  data?: unknown; // only for GeoJSON
  apiKey?: string;
}

export interface LayerDetailsDto {
  id: string;
  maxZoom?: number;
  minZoom?: number;
  source?: LayerSourceDto;
  legend?: LayerDetailsLegend;
  ownedByUser?: boolean;
}

export interface TileSource extends LayerSourceDto {
  type: 'vector' | 'raster';
  tileSize: number;
  urls: string[];
}

export interface GeoJSONSource extends LayerSourceDto {
  type: 'geojson';
  data: GeoJSON.FeatureCollection | GeoJSON.Feature;
}

export interface LayerGeoJSONSource extends LayerDetailsDto {
  source: GeoJSONSource;
}

export interface LayerTileSource extends LayerDetailsDto {
  source: TileSource;
}

// LayerSource is actually LayerDetailsDto
export type LayerSource = LayerGeoJSONSource | LayerTileSource;

export interface LayerSummaryDto {
  id: string;
  name: string;
  description?: string;
  category?: 'base' | 'overlay';
  group?: string;
  boundaryRequiredForRetrieval: boolean;
  eventIdRequiredForRetrieval?: boolean;
  copyrights?: string[];
  ownedByUser: boolean;
  featureProperties?: object;
  type?: string;
}
