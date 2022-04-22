import { Action } from '@reatom/core';
import { createAtom } from '~utils/atoms/createPrimitives';
import { layersSourcesAtom } from '~core/logical_layers/atoms/layersSources';
import { LayerInAreaDetails } from '../types';
import { LayerSource } from '~core/logical_layers/types/source';
import { layersLegendsAtom } from '~core/logical_layers/atoms/layersLegends';
import { LayerLegend } from '~core/logical_layers/types/legends';
import { legendFormatter } from '~features/layers_in_area/utils/legendFormatter';
import { areaLayersDetailsResourceAtom } from './areaLayersDetailsResource';

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
