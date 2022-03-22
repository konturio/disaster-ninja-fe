import { Action } from '@reatom/core';
import { createAtom } from '~utils/atoms/createPrimitives';
import { createResourceAtom } from '~utils/atoms/createResourceAtom';
import { apiClient } from '~core/index';
import { enabledLayersAtom } from '~core/logical_layers/atoms/enabledLayers';
import { layersSourcesAtom } from '~core/logical_layers/atoms/layersSources';
import { focusedGeometryAtom } from '~core/shared_state/focusedGeometry';
import { areaLayersResourceAtom } from './areaLayers';
import { LayerInAreaDetails } from '../types';
import { LayerSource } from '~core/logical_layers/types/source';
import { currentEventFeedAtom } from '~core/shared_state';
import { layersLegendsAtom } from '~core/logical_layers/atoms/layersLegends';
import { LayerLegend } from '~core/logical_layers/types/legends';
import { legendFormatter } from '~features/layers_in_area/utils/legendFormatter';

export interface DetailsRequestParams {
  layersToRetrieveWithGeometryFilter: string[];
  layersToRetrieveWithoutGeometryFilter: string[];
  geoJSON?: GeoJSON.GeoJSON;
  eventId?: string;
  eventFeed?: string;
}

function convertDetailsToSource(response: LayerInAreaDetails): LayerSource {
  /* Typescript makes me sad sometimes T.T */
  if ('url' in response.source) {
    const { url, ...restSource } = response.source;
    return {
      ...response,
      source: {
        ...restSource,
        urls: url,
      },
    } as LayerSource;
  } else {
    return response as LayerSource;
  }
}

function convertDetailsToLegends(
  response: LayerInAreaDetails,
): LayerLegend | null {
  if (!response.legend) return null;
  return legendFormatter(response.legend);
}

/* This atom subscribes to all data that required for request layer details  */
export const areaLayersDetailsParamsAtom = createAtom(
  {
    enabledLayersAtom,
    areaLayersResourceAtom,
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
      false,
    );
  },
  areaLayersDetailsParamsAtom,
);

// Update layers details (sources)
export const areaLayersDetails = createAtom(
  {
    areaLayersDetailsResourceAtom,
  },
  ({ get, schedule }) => {
    const layersDetails = get('areaLayersDetailsResourceAtom');
    const actions: Action[] = [];
    // Set loading state for details
    if (layersDetails.loading && layersDetails.lastParams) {
      const requestedLayers = [
        ...(layersDetails.lastParams?.layersToRetrieveWithGeometryFilter ?? []),
        ...(layersDetails.lastParams?.layersToRetrieveWithoutGeometryFilter ??
          []),
      ];
      requestedLayers.forEach((id) =>
        actions.push(
          layersSourcesAtom.change((state) => {
            const s = state.get(id);
            if (s) {
              state.set(id, { ...s, isLoading: true });
            }
            return state;
          }),
        ),
      );
    } else if (layersDetails.data) {
      const layersDetailsData = layersDetails.data;
      actions.push(
        // Update sources
        layersSourcesAtom.change((state) => {
          const newState = new Map(state);
          layersDetailsData.forEach((layerDetails) => {
            const layerSource = convertDetailsToSource(layerDetails);
            newState.set(layerDetails.id, {
              error: null,
              data: layerSource,
              isLoading: false,
            });
          });
          return newState;
        }),
        // Update legends
        layersLegendsAtom.change((state) => {
          const newState = new Map(state);
          layersDetailsData.forEach((layerDetails) => {
            const layerLegend = convertDetailsToLegends(layerDetails);
            newState.set(layerDetails.id, {
              error: null,
              data: layerLegend,
              isLoading: false,
            });
          });
          return newState;
        }),
      );
    }

    if (actions?.length) {
      schedule((dispatch) => {
        dispatch(actions);
      });
    }
  },
);
