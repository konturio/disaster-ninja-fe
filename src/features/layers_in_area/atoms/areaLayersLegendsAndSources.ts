import { createAtom } from '~utils/atoms/createPrimitives';
import { layersSourcesAtom } from '~core/logical_layers/atoms/layersSources';
import { layersLegendsAtom } from '~core/logical_layers/atoms/layersLegends';
import { legendFormatter } from '~features/layers_in_area/utils/legendFormatter';
import { areaLayersDetailsResourceAtom } from './areaLayersDetailsResource';
import type { LayerInAreaDetails } from '../types';
import type { LayerSource } from '~core/logical_layers/types/source';
import type { LayerLegend } from '~core/logical_layers/types/legends';
import type { Action } from '@reatom/core';

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
  return legendFormatter(response);
}

export const areaLayersLegendsAndSources = createAtom(
  {
    areaLayersDetailsResourceAtom,
  },
  ({ get, schedule }) => {
    const layersDetails = get('areaLayersDetailsResourceAtom');
    const actions: Action[] = [];
    // Set loading state for details
    if (layersDetails.canceled) {
      // find layers we won't need after request was canceled
      const canceledLayers: string[] = [];
      const canceledLayersIds1 =
        layersDetails.lastParams?.layersToRetrieveWithGeometryFilter.filter(
          (prevLayerId) =>
            !layersDetails.nextParams?.layersToRetrieveWithGeometryFilter.includes(
              prevLayerId,
            ),
        ) || [];
      const canceledLayersIds2 =
        layersDetails.lastParams?.layersToRetrieveWithoutGeometryFilter.filter(
          (prevLayerId) =>
            !layersDetails.nextParams?.layersToRetrieveWithoutGeometryFilter.includes(
              prevLayerId,
            ),
        ) || [];
      canceledLayers.push(...canceledLayersIds1, ...canceledLayersIds2);

      // remove them
      canceledLayers.forEach((layerId) => {
        actions.push(
          layersSourcesAtom.delete(layerId),
          layersLegendsAtom.delete(layerId),
        );
      });
    } else if (layersDetails.loading && layersDetails.lastParams) {
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
