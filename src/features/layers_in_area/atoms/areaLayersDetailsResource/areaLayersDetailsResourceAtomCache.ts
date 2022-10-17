import { createAtom } from '~utils/atoms/createPrimitives';
import { currentApplicationAtom, currentUserAtom } from '~core/shared_state';
import type { LayerInAreaDetails } from '../../types';
import type { DetailsRequestParams } from './types';

const createDefaultCacheState = (state?) => {
  type EventId = string | null;
  type LayerId = string;
  type AreaLayersDetailsResourceAtomCache = Map<
    EventId,
    Map<LayerId, LayerInAreaDetails>
  >;
  const cache: AreaLayersDetailsResourceAtomCache = state ? new Map(state) : new Map();
  return cache;
};

/* Store all prev request */
export const areaLayersDetailsResourceAtomCache = createAtom(
  {
    app: currentApplicationAtom,
    user: currentUserAtom,
    update: (request: DetailsRequestParams, response: LayerInAreaDetails[]) => ({
      request,
      response,
    }),
  },
  ({ onAction, onChange }, state = createDefaultCacheState()) => {
    onChange('app', () => {
      state = createDefaultCacheState();
    });

    onChange('user', () => {
      state = createDefaultCacheState();
    });

    onAction('update', ({ request, response }) => {
      state = createDefaultCacheState(state);
      const layersToRetrieveWithEventId = new Set(request.layersToRetrieveWithEventId);
      response.forEach((layer) => {
        const eventId = layersToRetrieveWithEventId.has(layer.id)
          ? request.eventId ?? null
          : null;
        if (!state.get(eventId)) {
          state.set(eventId, new Map());
        }
        state.get(eventId)!.set(layer.id, layer);
      });
    });
    return state;
  },
  'areaLayersDetailsResourceAtomCache',
);
