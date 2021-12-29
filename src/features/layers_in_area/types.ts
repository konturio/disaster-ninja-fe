import { LayerLegendBackend } from '~core/logical_layers/createLogicalLayerAtom/types';

interface TileSource {
  type: 'vector' | 'raster';
  url: string[];
  tileSize: number;
}

interface GeoJSONSource {
  type: 'geojson';
  data: GeoJSON.GeoJSON;
}

export interface LayerInArea {
  id: string;
  name: string;
  source: TileSource | GeoJSONSource;
  description?: string;
  category?: 'base' | 'overlay';
  group?: string;
  copyrights?: string[];
  legend?: LayerLegendBackend;
  boundaryRequiredForRetrieval: boolean;
}

export interface LayerGeoJSONSource {
  id: string;
  source: {
    type: 'geojson';
    data: GeoJSON.FeatureCollection | GeoJSON.Feature;
  };
}

export interface LayerTileSource {
  id: string;
  maxZoom: number;
  minZoom: number;
  source: {
    type: 'vector' | 'raster';
    tileSize: number;
    urls: string[];
  };
}
export type LayerInAreaSource = LayerGeoJSONSource | LayerTileSource;
