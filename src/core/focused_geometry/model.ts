import { crc32 } from 'hash-wasm';
import { createAtom } from '~utils/atoms';
import { currentUserAtom } from '~core/shared_state/currentUser';
import { episodesPanelState } from '../shared_state/episodesPanelState';
import type { FocusedGeometry, GeometrySource } from './types';

export const focusedGeometryAtom = createAtom(
  {
    setFocusedGeometry: (
      source: GeometrySource | null,
      geometry: GeoJSON.GeoJSON | null,
    ) => ({ source, geometry }),
    _update: (fGeometry: FocusedGeometry) => fGeometry,
    reset: () => null,
    currentUserAtom,
    episodesPanelState,
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
          const hash = await crc32(
            JSON.stringify({ geometry, source, user: user.email }),
          );
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
    onAction('reset', () => {
      state = null;
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
