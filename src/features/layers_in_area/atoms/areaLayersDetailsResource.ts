import { createAtom } from '~utils/atoms/createPrimitives';
import { createResourceAtom } from '~utils/atoms/createResourceAtom';
import { apiClient } from '~core/index';
import { enabledLayersAtom } from '~core/logical_layers/atoms/enabledLayers';
import { focusedGeometryAtom } from '~core/shared_state/focusedGeometry';
import { areaLayersListResource } from './areaLayersListResource';
import { LayerInAreaDetails } from '../types';
import { currentEventFeedAtom } from '~core/shared_state';

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

    const requestParams: DetailsRequestParams = {
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
        requestParams.eventId = focusedGeometry.source.meta.eventId;
      } else {
        throw Error(
          'Current geometry not from event, event related layer was selected',
        );
      }
    }

    if (focusedGeometry) {
      requestParams.geoJSON = focusedGeometry.geometry;
    }

    if (hasEventIdRequiredForRetrieval) {
      const eventFeed = getUnlistedState(currentEventFeedAtom);
      if (eventFeed) {
        requestParams.eventFeed = eventFeed.id;
      }
    }

    return requestParams;
  },
);

// Call api
export const areaLayersDetailsResourceAtom = createResourceAtom(
  async (params) => {
    if (params === null) return null;
    return await apiClient.post<LayerInAreaDetails[]>(
      '/layers/details',
      params,
      true,
    );
  },
  areaLayersDetailsParamsAtom,
);
