import type { LayerSource } from '~core/logical_layers/types/source';
import type { LayerLegend } from '~core/logical_layers/types/legends';

export interface DetailsRequestParams {
  layersToRetrieveWithGeometryFilter?: string[];
  layersToRetrieveWithoutGeometryFilter?: string[];
  layersToRetrieveWithEventId?: string[];
  geoJSON?: GeoJSON.GeoJSON;
  eventId?: string;
  eventFeed?: string;
  skip?: true;
}

export interface LayerData {
  source: LayerSource;
  legend: LayerLegend | null;
}
