import { LayerLegend } from '~core/logical_layers/createLogicalLayerAtom';
import { FocusedGeometry } from '~core/shared_state/focusedGeometry';

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
  legend?: LayerLegend;
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

export interface LayersInAreaParams {
  focusedGeometry: FocusedGeometry | null;
}

export interface LayerInAreaReactiveData {
  layer: LayerInArea;
  requestParams: LayersInAreaParams;
}
export type LayerInAreaSource = LayerGeoJSONSource | LayerTileSource;
