import { crc32 } from 'hash-wasm';
import { createAtom } from '~utils/atoms';
import { currentUserAtom } from '~core/shared_state/currentUser';
import type { GeometryWithHash } from '~core/focused_geometry/types';

export const referenceAreaAtom = createAtom(
  {
    setReferenceArea: (geometry: GeometryWithHash | null) => ({ geometry }),
    _update: (geometry: GeometryWithHash) => geometry,
    reset: () => null,
    currentUserAtom,
  },
  (
    { onAction, schedule, create, getUnlistedState, onChange },
    state: GeometryWithHash | null = null,
  ) => {
    onAction('setReferenceArea', ({ geometry }) => {
      // need to add user to cache to be able to reference area invalidate cache on login/logout
      const user = getUnlistedState(currentUserAtom);
      if (geometry) {
        schedule(async (dispatch, ctx: { hash?: string }) => {
          const hash = await crc32(JSON.stringify({ geometry, user: user.email }));
          // update only in case if geometry source or hash has changed
          if (!state || !ctx.hash || ctx.hash !== hash) {
            ctx.hash = hash;
            const geometryWithHash = { ...geometry, hash };
            dispatch(create('_update', geometryWithHash));
          }
        });
      } else {
        state = null;
      }
    });

    onAction('reset', () => {
      state = null;
    });

    onAction('_update', (geometry) => {
      state = geometry;
    });

    return state;
  },
  '[Shared state] referenceAreaAtom',
);
