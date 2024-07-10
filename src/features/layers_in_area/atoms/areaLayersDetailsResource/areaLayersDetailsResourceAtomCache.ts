import { createAtom } from '~utils/atoms/createPrimitives';
import type { LayerDetailsDto } from '~core/logical_layers/types/source';
import type { DetailsRequestParams } from './types';

type EventId = string | null;
type Hash = string;
type LayerId = string;
type AreaLayersDetailsResourceAtomCache = Map<
  EventId | Hash,
  Map<LayerId, LayerDetailsDto>
>;

const createDefaultCacheState = (state?) => {
  const cache: AreaLayersDetailsResourceAtomCache = state ? new Map(state) : new Map();
  return cache;
};

/*
Store all prev request
Cache structure:
  Map
  - key: focusedGeometry hash, value: Map | For layer with boundaryRequiredForRetrieval=true flag
  - key: eventId, value: Map | For layer with eventIdRequiredForRetrieval=true flag
  - key: null, value: Map | For layer with eventIdRequiredForRetrieval=false flag
*/

export const areaLayersDetailsResourceAtomCache = createAtom(
  {
    update: (request: DetailsRequestParams, response: LayerDetailsDto[]) => ({
      request,
      response,
    }),
  },
  ({ onAction }, state = createDefaultCacheState()) => {
    onAction('update', ({ request, response }) => {
      state = createDefaultCacheState(state);
      const layersToRetrieveWithEventId = new Set(request.layersToRetrieveWithEventId);
      const layersToRetrieveWithGeometryFilter = new Set(
        request.layersToRetrieveWithGeometryFilter,
      );
      response.forEach((layer) => {
        const cacheKey: string | null = getLayersDetailsCacheKey({
          boundaryRequiredForRetrieval: layersToRetrieveWithGeometryFilter.has(layer.id),
          eventIdRequiredForRetrieval: layersToRetrieveWithEventId.has(layer.id),
          eventId: request.eventId,
          hash: request.geoJSON?.hash,
        });

        if (!state.get(cacheKey)) {
          state.set(cacheKey, new Map());
        }
        state.get(cacheKey)!.set(layer.id, layer);
      });
    });
    return state;
  },
  'areaLayersDetailsResourceAtomCache',
);

export const getLayersDetailsCacheKey = ({
  boundaryRequiredForRetrieval,
  eventIdRequiredForRetrieval,
  eventId,
  hash,
}: {
  boundaryRequiredForRetrieval?: boolean;
  eventIdRequiredForRetrieval?: boolean;
  eventId?: string | null;
  hash?: string;
}): string | null => {
  if (boundaryRequiredForRetrieval && hash) {
    return hash;
  } else if (eventIdRequiredForRetrieval && eventId) {
    return eventId;
  }
  return null;
};
