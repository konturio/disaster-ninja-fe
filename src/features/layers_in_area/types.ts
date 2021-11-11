import { LayerLegend } from '~utils/atoms/createLogicalLayerAtom';
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
  copyright?: string;
  legend: LayerLegend;
  boundaryRequiredForRetrieval: boolean;
}

interface LayerGeoJSONSource {
  id: string;
  source: {
    type: 'geojson';
    data: GeoJSON.GeoJSON;
  };
}

interface LayerTileSource {
  id: string;
  maxZoom: number;
  minZoom: number;
  source: {
    type: 'vector' | 'raster';
    tileSize: number;
    url: string[];
  };
}
export type LayerInAreaSource = LayerGeoJSONSource | LayerTileSource;
