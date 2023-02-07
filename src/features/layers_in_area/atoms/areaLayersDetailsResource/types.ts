import type { GeometryWithHash } from '~core/focused_geometry/types';
import type { LayerSource } from '~core/logical_layers/types/source';
import type { LayerLegend } from '~core/logical_layers/types/legends';

export interface DetailsRequestParams {
  layersToRetrieveWithGeometryFilter?: string[];
  layersToRetrieveWithoutGeometryFilter?: string[];
  layersToRetrieveWithEventId?: string[];
  geoJSON?: GeometryWithHash;
  eventId?: string;
  eventFeed?: string;
  skip?: true;
}

export interface LayerData {
  source: LayerSource;
  legend: LayerLegend | null;
}
