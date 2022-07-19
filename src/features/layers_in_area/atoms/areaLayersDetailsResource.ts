import { createAtom } from '~utils/atoms/createPrimitives';
import { apiClient } from '~core/apiClientInstance';
import { enabledLayersAtom } from '~core/logical_layers/atoms/enabledLayers';
import { focusedGeometryAtom } from '~core/shared_state/focusedGeometry';
import { currentEventFeedAtom } from '~core/shared_state';
import { createResourceAtom } from '~utils/atoms';
import { areaLayersListResource } from './areaLayersListResource';
import type { LayerInAreaDetails } from '../types';

export interface DetailsRequestParams {
  layersToRetrieveWithGeometryFilter: string[];
  layersToRetrieveWithoutGeometryFilter: string[];
  geoJSON?: GeoJSON.GeoJSON;
  eventId?: string;
  eventFeed?: string;
}

/* This atom subscribes to all data that required for request layer details  */
export const areaLayersDetailsParamsAtom = createAtom(
  {
    enabledLayersAtom,
    areaLayersResourceAtom: areaLayersListResource,
  },
  (
    { get, getUnlistedState },
    state: DetailsRequestParams | null = null,
  ): DetailsRequestParams | null => {
    const areaLayersResource = get('areaLayersResourceAtom');
    if (areaLayersResource.loading || areaLayersResource.data === null)
      return state;
    const availableLayersInArea = areaLayersResource.data;
    if (availableLayersInArea === undefined) return null;

    const enabledLayers = get('enabledLayersAtom');
    let hasEventIdRequiredForRetrieval = false;
    const [
      layersToRetrieveWithGeometryFilter,
      layersToRetrieveWithoutGeometryFilter,
    ] = availableLayersInArea.reduce(
      (acc, layer) => {
        if (enabledLayers.has(layer.id)) {
          acc[layer.boundaryRequiredForRetrieval ? 0 : 1].push(layer.id);
          if (
            !hasEventIdRequiredForRetrieval &&
            layer.eventIdRequiredForRetrieval
          ) {
            hasEventIdRequiredForRetrieval = true;
          }
        }
        return acc;
      },
      [[], []] as [string[], string[]],
    );

    if (
      layersToRetrieveWithGeometryFilter.length +
        layersToRetrieveWithoutGeometryFilter.length ===
      0
    ) {
      return null;
    }

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
        throw Error(
          'Current geometry not from event, event related layer was selected',
        );
      }
    }

    /**
     * After we select area layers from changed `enabledLayers` set
     * we can check - do we have a difference from the last request?
     * If not - just return previous result!
     */
    if (
      state &&
      newState.eventId === state.eventId &&
      arraysAreEqual(
        newState.layersToRetrieveWithGeometryFilter,
        state.layersToRetrieveWithGeometryFilter,
      ) &&
      arraysAreEqual(
        newState.layersToRetrieveWithoutGeometryFilter,
        state.layersToRetrieveWithoutGeometryFilter,
      )
    ) {
      return state;
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

// Call api
export const areaLayersDetailsResourceAtom = createResourceAtom(
  (params) => {
    async function processor(): Promise<LayerInAreaDetails[] | null> {
      if (params === null) return null;
      try {
        const request = await apiClient.post<LayerInAreaDetails[]>(
          '/layers/details',
          params,
          true,
        );
        return request ?? null;
      } catch (e) {
        throw e;
      }
    }

    return { processor, allowCancel: true };
  },
  'areaLayersDetailsResourceAtom',
  areaLayersDetailsParamsAtom,
);

function arraysAreEqual(arr1: any[], arr2: any[]) {
  return (
    arr1.length === arr2.length &&
    arr1.every((value, index) => value === arr2[index])
  );
}
