import type { Action } from '@reatom/core';
import { createAtom } from '~utils/atoms/createPrimitives';
import { layersSourcesAtom } from '~core/logical_layers/atoms/layersSources';
import type { LayerInAreaDetails } from '../types';
import type { LayerSource } from '~core/logical_layers/types/source';
import { layersLegendsAtom } from '~core/logical_layers/atoms/layersLegends';
import type { LayerLegend } from '~core/logical_layers/types/legends';
import { legendFormatter } from '~features/layers_in_area/utils/legendFormatter';
import { editableLayersDetailsResourceAtom } from './editableLayersDetailsResource';

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

export const editableLayersLegendsAndSources = createAtom(
  {
    editableLayersDetailsResourceAtom,
  },
  ({ get, schedule }) => {
    const layersDetails = get('editableLayersDetailsResourceAtom');
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
