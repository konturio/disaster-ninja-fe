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
  geoJSON?: GeoJSON.GeoJSON;
  eventId?: string;
  eventFeed?: string;
}
/* Store all prev request */
const areaLayersDetailsResourceAtomCache = createAtom(
  {
    app: currentApplicationAtom,
    user: currentUserAtom,
    add: (details: LayerInAreaDetails[]) => details,
  },
  ({ onAction, onChange }, state = new Map<string, LayerInAreaDetails>()) => {
    onChange('app', () => {
      state = new Map();
    });

    onChange('user', () => {
      state = new Map();
    });

    onAction('add', (newData) => {
      state = new Map(state);
      newData.forEach((details) => {
        state.set(details.id, details);
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
    const cache = getUnlistedState(areaLayersDetailsResourceAtomCache);
    const mustBeRequested = allLayers.filter((layer) => {
      const isEnabled = enabledLayers.has(layer.id);
      const isNotInCache = !cache.has(layer.id);
      return isEnabled && isNotInCache;
    });

    if (mustBeRequested.length === 0) return state; // Do not request anything

    let hasEventIdRequiredForRetrieval = false;
    const [layersToRetrieveWithGeometryFilter, layersToRetrieveWithoutGeometryFilter] =
      mustBeRequested.reduce(
        (acc, layer) => {
          acc[layer.boundaryRequiredForRetrieval ? 0 : 1].push(layer.id);
          if (!hasEventIdRequiredForRetrieval && layer.eventIdRequiredForRetrieval) {
            hasEventIdRequiredForRetrieval = true;
          }
          return acc;
        },
        [[], []] as [string[], string[]],
      );

    const newState: DetailsRequestParams = {
      layersToRetrieveWithGeometryFilter,
      layersToRetrieveWithoutGeometryFilter,
    };

    /**
     * To avoid double request case:
     * (one for enabled layers list, second for focused geometry change)
     * I'm use getUnlistedState here. This atom still updated on focusedGeometryAtom changes
     * because areaLayersResourceAtom subscribed to focusedGeometryAtom
     */
    const focusedGeometry = getUnlistedState(focusedGeometryAtom);
    if (hasEventIdRequiredForRetrieval) {
      if (focusedGeometry?.source?.type === 'event') {
        newState.eventId = focusedGeometry.source.meta.eventId;
      } else {
        throw Error('Current geometry not from event, event related layer was selected');
      }
    }

    if (focusedGeometry) {
      newState.geoJSON = focusedGeometry.geometry;
    }

    if (hasEventIdRequiredForRetrieval) {
      const eventFeed = getUnlistedState(currentEventFeedAtom);
      if (eventFeed) {
        newState.eventFeed = eventFeed.id;
      }
    }

    return newState;
  },
);

export const areaLayersDetailsResourceAtom = createAsyncAtom(
  areaLayersDetailsParamsAtom,
  async (params, abortController) => {
    if (params === null) return null;
    const request = await apiClient.post<LayerInAreaDetails[]>(
      '/layers/details',
      params,
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
    onSuccess: (dispatch, response) =>
      response && dispatch(areaLayersDetailsResourceAtomCache.add(response)),
  },
);
