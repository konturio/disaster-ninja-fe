import type { Episode, EventWithGeometry } from '~core/types';

interface GeometrySourceEvent {
  type: 'event';
  meta: EventWithGeometry;
}

interface GeometrySourceEpisode {
  type: 'episode';
  meta: Episode;
}

interface GeometrySourceCustom {
  type: 'custom';
}

interface GeometrySourceFromFile {
  type: 'uploaded';
}

interface GeometrySourceBoundaries {
  type: 'boundaries';
  meta: { name: string };
}

interface GeometrySourceDrawn {
  type: 'drawn';
}

export type GeometrySource =
  | GeometrySourceEpisode
  | GeometrySourceEvent
  | GeometrySourceCustom
  | GeometrySourceBoundaries
  | GeometrySourceFromFile
  | GeometrySourceDrawn;

export type GeometryWithHash = GeoJSON.GeoJSON & { hash?: string };

export interface FocusedGeometry {
  source: GeometrySource;
  geometry: GeometryWithHash;
}
