export interface DetailsRequestParams {
  layersToRetrieveWithGeometryFilter: string[];
  layersToRetrieveWithoutGeometryFilter: string[];
  layersToRetrieveWithEventId: string[];
  geoJSON?: GeoJSON.GeoJSON;
  eventId?: string;
  eventFeed?: string;
}
