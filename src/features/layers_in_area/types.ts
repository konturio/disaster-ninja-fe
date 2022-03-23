import { LayerLegend } from '~core/logical_layers/types/legends';
import { UserDataFeaturePropertiesType } from '~core/logical_layers/types/userData';

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
  featureProperties?: UserDataFeaturePropertiesType;
  boundaryRequiredForRetrieval: boolean;
  eventIdRequiredForRetrieval?: boolean;
  ownedByUser: boolean;
}

export interface GeoJSONSourceSourceContainer {
  id: string;
  source: GeoJSONSource;
  legend: LayerLegend;
}

export interface TileSourceContainer {
  id: string;
  maxZoom: number;
  minZoom: number;
  source: TileSource;
  legend?: LayerLegend;
}

export type LayerInAreaDetails =
  | GeoJSONSourceSourceContainer
  | TileSourceContainer;
