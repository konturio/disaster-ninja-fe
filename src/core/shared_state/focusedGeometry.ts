import { createBindAtom } from '~utils/atoms/createBindAtom';
import { EventWithGeometry } from '~core/types';
import { crc32 } from 'hash-wasm';

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
  geometryHash: string;
}

export const focusedGeometryAtom = createBindAtom(
  {
    setFocusedGeometry: (
      source: GeometrySource | null,
      geometry: GeoJSON.GeoJSON | null,
    ) => ({ source, geometry }),
    _update: (fGeometry: FocusedGeometry) => fGeometry,
  },
  ({ onAction, schedule, create }, state: FocusedGeometry | null = null) => {
    onAction('setFocusedGeometry', ({ source, geometry }) => {
      if (source && geometry) {
        schedule(async (dispatch) => {
          const geometryHash = await crc32(JSON.stringify(geometry));
          // update only in case if geometry source or hash has changed
          if (!state || state.source?.type !== source.type || state.geometryHash !== geometryHash) {
            dispatch(create('_update', { source, geometry, geometryHash }));
          }
        });
      } else {
        state = null;
      }
    });
    onAction('_update', (fGeometry) => {
      state = fGeometry;
    });
    return state;
  },
  '[Shared state] focusedGeometryAtom',
);
