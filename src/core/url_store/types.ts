type Zoom = number;
type Lat = number;
type Lng = number;

export type UrlData = {
  map?: [Zoom, Lat, Lng];
  event?: string;
  episode?: string;
  layers?: string[];
  bv?: string; // bivariate state hash
  app?: string;
  feed?: string;
  bbox?: [[number, number], [number, number]];
  presentationMode: string;
};
