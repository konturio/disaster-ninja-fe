import { createAtom } from '~utils/atoms/createPrimitives';
import { currentUserAtom } from '~core/shared_state';
import type { LayerInAreaDetails } from '../../types';
import type { DetailsRequestParams } from './types';

type EventId = string | null;
type Hash = string;
type LayerId = string;
type AreaLayersDetailsResourceAtomCache = Map<
  EventId | Hash,
  Map<LayerId, LayerInAreaDetails> | boolean
>;

const createDefaultCacheState = (state?) => {
  const cache: AreaLayersDetailsResourceAtomCache = state ? new Map(state) : new Map();
  return cache;
};

/* 
Store all prev request
Cache structure: 
  Map 
  - key: focusedGeometry hash, value: true | For layer with boundaryRequiredForRetrieval=true flag
  - key: eventId, value: Map | For layer with eventIdRequiredForRetrieval=true flag
  - key: null, value: Map | For layer with eventIdRequiredForRetrieval=false flag
*/

export const areaLayersDetailsResourceAtomCache = createAtom(
  {
    user: currentUserAtom,
    update: (request: DetailsRequestParams, response: LayerInAreaDetails[]) => ({
      request,
      response,
    }),
  },
  ({ onAction, onChange }, state = createDefaultCacheState()) => {
    onChange('user', () => {
      state = createDefaultCacheState();
    });

    onAction('update', ({ request, response }) => {
      state = createDefaultCacheState(state);
      const layersToRetrieveWithEventId = new Set(request.layersToRetrieveWithEventId);
      const layersToRetrieveWithGeometryFilter = new Set(
        request.layersToRetrieveWithGeometryFilter,
      );
      response.forEach((layer) => {
        if (layersToRetrieveWithGeometryFilter.has(layer.id)) {
          const geometryHash = request?.geoJSON?.hash;
          if (geometryHash && !state.get(geometryHash)) {
            state.set(geometryHash, true);
          }
          return state;
        }

        const eventId = layersToRetrieveWithEventId.has(layer.id)
          ? request.eventId ?? null
          : null;
        if (!state.get(eventId)) {
          state.set(eventId, new Map());
        }

        const cacheValue = state.get(eventId);
        if (cacheValue instanceof Map) {
          cacheValue.set(layer.id, layer);
        }
      });
    });
    return state;
  },
  'areaLayersDetailsResourceAtomCache',
);
