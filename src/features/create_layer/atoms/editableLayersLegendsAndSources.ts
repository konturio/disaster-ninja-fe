import { createAtom } from '~utils/atoms/createPrimitives';
import { layersSourcesAtom } from '~core/logical_layers/atoms/layersSources';
import { layersLegendsAtom } from '~core/logical_layers/atoms/layersLegends';
import { legendFormatter } from '~core/logical_layers/utils/legendFormatter';
import { editableLayersDetailsResourceAtom } from './editableLayersDetailsResource';
import type { LayerSource, LayerDetailsDTO } from '~core/logical_layers/types/source';
import type { LayerLegend } from '~core/logical_layers/types/legends';
import type { Action } from '@reatom/core';

function convertDetailsToSource(response: LayerDetailsDTO): LayerSource {
  /* Typescript makes me sad sometimes T.T */
  if ('urls' in response.source) {
    const { urls, ...restSource } = response.source;
    return {
      ...response,
      source: {
        ...restSource,
        urls: urls,
      },
    } as LayerSource;
  } else {
    return response as LayerSource;
  }
}

function convertDetailsToLegends(response: LayerDetailsDTO): LayerLegend | null {
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
        ...(layersDetails.lastParams?.layersToRetrieveWithoutGeometryFilter ?? []),
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
  'editableLayersLegendsAndSources',
);
