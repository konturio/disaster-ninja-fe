import { createAtom } from '~utils/atoms/createPrimitives';
import { layersSourcesAtom } from '~core/logical_layers/atoms/layersSources';
import { layersLegendsAtom } from '~core/logical_layers/atoms/layersLegends';
import { legendFormatter } from '~features/layers_in_area/utils/legendFormatter';
import { focusedGeometryAtom } from '~core/focused_geometry/model';
import { getEventId } from '~core/focused_geometry/utils';
import { areaLayersDetailsResourceAtom } from './areaLayersDetailsResource';
import { areaLayersDetailsResourceAtomCache } from './areaLayersDetailsResource/areaLayersDetailsResourceAtomCache';
import type { Action } from '@reatom/core';
import type { LayerInAreaDetails } from '../types';
import type { LayerSource } from '~core/logical_layers/types/source';
import type { LayerLegend } from '~core/logical_layers/types/legends';

function convertDetailsToSource(response: LayerInAreaDetails): LayerSource | null {
  if (!('source' in response)) {
    return null;
  }

  if (response.source.type === 'vector' || response.source.type === 'raster') {
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

function convertDetailsToLegends(response: LayerInAreaDetails): LayerLegend | null {
  if (!('legend' in response) || !response.legend) return null;
  return legendFormatter(response);
}

export const areaLayersLegendsAndSources = createAtom(
  {
    areaLayersDetailsResourceAtom,
    focusedGeometryAtom,
  },
  ({ get, schedule, getUnlistedState }) => {
    const layersDetails = get('areaLayersDetailsResourceAtom');
    const actions: Action[] = [];
    const requestedLayers = [
      ...(layersDetails.lastParams?.layersToRetrieveWithGeometryFilter ?? []),
      ...(layersDetails.lastParams?.layersToRetrieveWithoutGeometryFilter ?? []),
    ];

    // Loading started
    if (layersDetails.loading) {
      const layersSources = getUnlistedState(layersSourcesAtom);
      requestedLayers.forEach((id) => {
        // I am not reset source while new srs loading to reduce map blinking
        const source = layersSources.get(id);
        if (source)
          actions.push(
            layersSourcesAtom.set(id, { ...source, error: null, isLoading: true }),
          );
      });
      return;
    }

    // Loading finished
    if (!layersDetails.loading) {
      // Create index for data
      const layersDetailsData = (layersDetails.data ?? []).reduce((acc, layerDetails) => {
        acc.set(layerDetails.id, layerDetails);
        return acc;
      }, new Map<string, LayerInAreaDetails>());

      // apply cached layers if any are already stored for current eventId
      const focusedGeometry = get('focusedGeometryAtom');
      const eventId = getEventId(focusedGeometry);
      if (eventId) {
        const cache = getUnlistedState(areaLayersDetailsResourceAtomCache);
        const cachedEventIdRequiredLayers = cache.get(eventId);
        cachedEventIdRequiredLayers?.forEach((layer) =>
          layersDetailsData.set(layer.id, layer),
        );

        const hash = focusedGeometry?.geometry.hash;
        if (hash) {
          const cachedBoundaryRequiredLayers = cache.get(hash);
          cachedBoundaryRequiredLayers?.forEach((layer) => {
            layersDetailsData.set(layer.id, layer);
          });
        }
      }
      // One error for all requested details
      const layersDetailsError = layersDetails.error ? Error(layersDetails.error) : null;

      const updateSourcesAction = layersSourcesAtom.change((state) => {
        const newState = new Map(state);
        layersDetailsData.forEach((layerDetails, layerId) => {
          const layerSource = layerDetails ? convertDetailsToSource(layerDetails) : null;
          const prevSource = newState.get(layerId);
          if (prevSource?.data && !layerSource) {
            console.warn(
              `
            Attempt to remove source for layer ${layerDetails.id}. 
            Previous source: 
            `,
              prevSource,
            );
            return;
          }
          newState.set(layerId, {
            error: layersDetailsError,
            data: layerSource,
            isLoading: false,
          });
        });
        return newState;
      });

      const updateLegendsAction = layersLegendsAtom.change((state) => {
        const newState = new Map(state);
        layersDetailsData.forEach((layerDetails, layerId) => {
          const layerLegend = layerDetails ? convertDetailsToLegends(layerDetails) : null;
          const prevLegend = newState.get(layerId);
          if (prevLegend?.data && !layerLegend) {
            console.warn(
              `
            Attempt to remove legend for layer ${layerDetails.id}. 
            Previous legend: 
            `,
              prevLegend,
            );
            return;
          }
          newState.set(layerId, {
            error: layersDetailsError,
            data: layerLegend,
            isLoading: false,
          });
        });

        return newState;
      });

      actions.push(updateSourcesAction, updateLegendsAction);
    }

    if (actions?.length) {
      schedule((dispatch) => {
        dispatch(actions);
      });
    }
  },
  'areaLayersLegendsAndSources',
);
