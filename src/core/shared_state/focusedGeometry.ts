import { crc32 } from 'hash-wasm';
import { createAtom } from '~utils/atoms';
import { currentUserAtom } from '~core/shared_state/currentUser';
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
    currentUserAtom,
  },
  (
    { onAction, schedule, create, getUnlistedState, onChange },
    state: FocusedGeometry | null = null,
  ) => {
    onAction('setFocusedGeometry', ({ source, geometry }) => {
      // need to add user to cache to be able to focused geometry invalidate cache on login/logout
      const user = getUnlistedState(currentUserAtom);
      if (source && geometry) {
        schedule(async (dispatch, ctx: { hash?: string }) => {
          const hash = await crc32(JSON.stringify({ geometry, source, user: user.id }));
          // update only in case if geometry source or hash has changed
          if (!state || !ctx.hash || ctx.hash !== hash) {
            ctx.hash = hash;
            const geometryWithHash = { ...geometry, hash };
            dispatch(create('_update', { source, geometry: geometryWithHash }));
          }
        });
      } else {
        state = null;
      }
    });
    onAction('_update', (fGeometry) => {
      state = fGeometry;
    });
    onChange('currentUserAtom', () => {
      // immediately update focused geometry on login/logout if we are not in event context (draw tool, boundary selector)
      if (state && state.source?.type !== 'event') {
        state = { ...state };
      }
    });
    return state;
  },
  '[Shared state] focusedGeometryAtom',
);

export function getEventId(focusedGeometry: FocusedGeometry | null) {
  return focusedGeometry?.source?.type === 'event'
    ? focusedGeometry.source.meta.eventId
    : null;
}

export const FOCUSED_GEOMETRY_LOGICAL_LAYER_ID = 'focused-geometry';
