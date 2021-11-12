import { createBindAtom } from '~utils/atoms/createBindAtom';
import { EventWithGeometry } from '~appModule/types';

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
}

type GeometrySource =
  | GeometrySourceEvent
  | GeometrySourceCustom
  | GeometrySourceBoundaries
  | GeometrySourceFromFile;

export interface FocusedGeometry {
  source: GeometrySource;
  geometry: GeoJSON.GeoJSON;
}

export const focusedGeometryAtom = createBindAtom(
  {
    setFocusedGeometry: (
      source: GeometrySource,
      geometry: GeoJSON.GeoJSON,
    ) => ({ source, geometry }),
  },
  ({ onAction }, state: FocusedGeometry | null = null) => {
    onAction('setFocusedGeometry', ({ source, geometry }) => {
      state = {
        source,
        geometry,
      };
    });
    return state;
  },
  '[Shared state] focusedGeometryAtom',
);
