import { createAtom, createBooleanAtom } from '~utils/atoms';
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
}

export const focusedGeometryAtom = createAtom(
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
        schedule(async (dispatch, ctx: { hash?: string }) => {
          const hash = await crc32(JSON.stringify({ geometry, source }));
          // update only in case if geometry source or hash has changed
          if (!state || !ctx.hash || ctx.hash !== hash) {
            ctx.hash = hash;
            dispatch(create('_update', { source, geometry }));
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

export const focusedGeometryVisibilityAtom = createBooleanAtom(true);
