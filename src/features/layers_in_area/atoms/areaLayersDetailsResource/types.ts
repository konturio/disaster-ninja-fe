import type { LayerSource } from '~core/logical_layers/types/source';
import type { LayerLegend } from '~core/logical_layers/types/legends';
import type { LayerInAreaDetails } from '../../types';

export interface DetailsRequestParams {
  layersToRetrieveWithGeometryFilter: string[];
  layersToRetrieveWithoutGeometryFilter: string[];
  layersToRetrieveWithEventId: string[];
  geoJSON?: GeoJSON.GeoJSON;
  eventId?: string;
  eventFeed?: string;
  cached: LayerInAreaDetails[];
}

export interface LayerData {
  source: LayerSource;
  legend: LayerLegend | null;
}
