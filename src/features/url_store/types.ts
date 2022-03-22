type Zoom = number;
type Lat = number;
type Lng = number;

export interface UrlData {
  map?: [Zoom, Lng, Lat];
  event?: string;
  episode?: string;
  layers?: string[];
  bv?: string; // bivariate state hash
  app?: string;
}
