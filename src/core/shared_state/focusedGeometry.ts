import { createBindAtom } from '~utils/atoms/createBindAtom';
import { EventWithGeometry } from '~core/types';

interface GeometrySourceEvent {
  type: 'event';
  meta: EventWithGeometry;
}

interface GeometrySourceCustom {
  type: 'custom';
}

interface GeometrySourceFromFile {
  type: 'uploaded';
}

interface GeometrySourceBoundaries {
  type: 'boundaries';
  meta: string;
}

interface GeometrySourceDrawn {
  type: 'drawn';
}


type GeometrySource =
  | GeometrySourceEvent
  | GeometrySourceCustom
  | GeometrySourceBoundaries
  | GeometrySourceFromFile
  | GeometrySourceDrawn;

export interface FocusedGeometry {
  source: GeometrySource;
  geometry: GeoJSON.GeoJSON;
}

export const focusedGeometryAtom = createBindAtom(
  {
    setFocusedGeometry: (
      source: GeometrySource | null,
      geometry: GeoJSON.GeoJSON | null,
    ) => ({ source, geometry }),
  },
  ({ onAction }, state: FocusedGeometry | null = null) => {
    onAction('setFocusedGeometry', ({ source, geometry }) => {
      if (source && geometry) state = {
        source,
        geometry,
      };
      else state = null
    });
    return state;
  },
  '[Shared state] focusedGeometryAtom',
);
