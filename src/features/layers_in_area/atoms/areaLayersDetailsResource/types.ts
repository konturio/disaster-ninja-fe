import type { GeometryWithHash } from '~core/focused_geometry/types';

export interface DetailsRequestParams {
  layersToRetrieveWithGeometryFilter?: string[];
  layersToRetrieveWithoutGeometryFilter?: string[];
  layersToRetrieveWithEventId?: string[];
  geoJSON?: GeometryWithHash;
  eventId?: string;
  eventFeed?: string;
  skip?: true;
}
