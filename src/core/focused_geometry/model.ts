import { crc32 } from 'hash-wasm';
import { createAtom } from '~utils/atoms';
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
    episodesPanelState,
  },
  (
    { onAction, schedule, create, getUnlistedState, onChange },
    state: FocusedGeometry | null = null,
  ) => {
    onAction('setFocusedGeometry', ({ source, geometry }) => {
      if (source && geometry) {
        schedule(async (dispatch, ctx: { hash?: string }) => {
          const hash = await crc32(JSON.stringify({ geometry, source }));
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

    return state;
  },
  '[Shared state] focusedGeometryAtom',
);
