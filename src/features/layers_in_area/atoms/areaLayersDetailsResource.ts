import { createAtom } from '~utils/atoms/createPrimitives';
import { apiClient } from '~core/apiClientInstance';
import { enabledLayersAtom } from '~core/logical_layers/atoms/enabledLayers';
import { focusedGeometryAtom } from '~core/shared_state/focusedGeometry';
import {
  currentApplicationAtom,
  currentEventFeedAtom,
  currentUserAtom,
} from '~core/shared_state';
import { createAsyncAtom } from '~utils/atoms/createAsyncAtom';
import { layersGlobalResource } from './layersGlobalResource';
import { layersInAreaAndEventLayerResource } from './layersInAreaAndEventLayerResource';
import type { LayerInAreaDetails } from '../types';

export interface DetailsRequestParams {
  layersToRetrieveWithGeometryFilter: string[];
  layersToRetrieveWithoutGeometryFilter: string[];
  layersToRetrieveWithEventId: string[];
  geoJSON?: GeoJSON.GeoJSON;
  eventId?: string;
  eventFeed?: string;
}

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
const areaLayersDetailsResourceAtomCache = createAtom(
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

export const areaLayersDetailsParamsAtom = createAtom(
  {
    enabledLayersAtom,
    layersGlobalResource,
    layersInAreaAndEventLayerResource,
  },
  (
    { get, getUnlistedState },
    state: DetailsRequestParams | null = null,
  ): DetailsRequestParams | null => {
    const layersGlobal = get('layersGlobalResource');
    const layersInAreaAndEventLayer = get('layersInAreaAndEventLayerResource');
    const allLayers = [
      ...(layersGlobal.data ?? []),
      ...(layersInAreaAndEventLayer.data ?? []),
    ];
    const enabledLayers = get('enabledLayersAtom');
    const focusedGeometry = getUnlistedState(focusedGeometryAtom);
    const eventId =
      focusedGeometry?.source?.type === 'event'
        ? focusedGeometry.source.meta.eventId
        : null;
    const cache = getUnlistedState(areaLayersDetailsResourceAtomCache);
    const mustBeRequested = allLayers.filter((layer) => {
      const isEnabled = enabledLayers.has(layer.id);
      const isInCache = cache.get(eventId)?.has(layer.id) ?? false;
      return isEnabled && !isInCache;
    });

    if (mustBeRequested.length === 0) return state; // Do not request anything

    const [
      layersToRetrieveWithGeometryFilter,
      layersToRetrieveWithoutGeometryFilter,
      layersToRetrieveWithEventId,
    ] = mustBeRequested.reduce(
      (acc, layer) => {
        acc[layer.boundaryRequiredForRetrieval ? 0 : 1].push(layer.id);
        if (layer.eventIdRequiredForRetrieval) {
          acc[2].push(layer.id);
        }
        return acc;
      },
      [[], [], []] as [string[], string[], string[]],
    );

    const newState: DetailsRequestParams = {
      layersToRetrieveWithGeometryFilter,
      layersToRetrieveWithoutGeometryFilter,
      layersToRetrieveWithEventId,
    };

    /**
     * To avoid double request case:
     * (one for enabled layers list, second for focused geometry change)
     * I'm use getUnlistedState here. This atom still updated on focusedGeometryAtom changes
     * because areaLayersResourceAtom subscribed to focusedGeometryAtom
     */
    if (layersToRetrieveWithEventId.length) {
      if (eventId) {
        newState.eventId = eventId;
        const eventFeed = getUnlistedState(currentEventFeedAtom);
        if (eventFeed) newState.eventFeed = eventFeed.id;
      } else {
        throw Error('Current geometry not from event, event related layer was selected');
      }
    }

    if (focusedGeometry) {
      newState.geoJSON = focusedGeometry.geometry;
    }

    return newState;
  },
);

export const areaLayersDetailsResourceAtom = createAsyncAtom(
  areaLayersDetailsParamsAtom,
  async (params, abortController) => {
    if (params === null) return null;
    // exclude layersToRetrieveWithEventId from body - in needed just for cache invalidation
    const { layersToRetrieveWithEventId, ...body } = params;
    const request = await apiClient.post<LayerInAreaDetails[]>(
      '/layers/details',
      body,
      true,
      {
        signal: abortController.signal,
        errorsConfig: {
          dontShowErrors: true,
        },
      },
    );
    return request ?? null;
  },
  'areaLayersDetailsResourceAtom',
  {
    onSuccess: (dispatch, request, response) => {
      if (response === null) return;
      if (request === null) return;
      dispatch(areaLayersDetailsResourceAtomCache.update(request, response));
    },
  },
);
