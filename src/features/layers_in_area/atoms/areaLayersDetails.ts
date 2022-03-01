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

export interface DetailsRequestParams {
  layerIds: string[];
  geoJSON?: GeoJSON.GeoJSON;
  eventId?: string;
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
    /**
     * Layer list already depends from focused geometry.
     * This atom must update only layer list changes,
     * But it still required focused geometry
     */
    const enabledLayers = get('enabledLayersAtom');
    const layerIds = availableLayersInArea.reduce((acc, layer) => {
      if (enabledLayers.has(layer.id)) acc.push(layer.id);
      return acc;
    }, [] as string[]);

    const requestParams: DetailsRequestParams = {
      layerIds,
    };

    if (!requestParams.layerIds?.length) {
      return null;
    }

    const focusedGeometry = getUnlistedState(focusedGeometryAtom);
    if (focusedGeometry?.source?.type === 'event') {
      requestParams.eventId = focusedGeometry.source.meta.eventId;
    }

    if (focusedGeometry) {
      requestParams.geoJSON = focusedGeometry.geometry;
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
      layersDetails.lastParams?.layerIds?.forEach((id) =>
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
        layersSourcesAtom.change((state) => {
          layersDetailsData.forEach((layerDetails) => {
            const layerSource = convertDetailsToSource(layerDetails);
            state.set(layerSource.id, {
              error: null,
              data: layerSource,
              isLoading: false,
            });
          });
          return state;
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
