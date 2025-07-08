import type { GeometryWithHash } from '~core/focused_geometry/types';

export interface DetailsRequestParams {
  /**
   * Layer ids without context suffix
   */
  layersToRetrieveWithGeometryFilter?: string[];
  layersToRetrieveWithoutGeometryFilter?: string[];
  layersToRetrieveWithEventId?: string[];
  geoJSON?: GeometryWithHash;
  eventId?: string;
  eventFeed?: string;
  skip?: true;
}
