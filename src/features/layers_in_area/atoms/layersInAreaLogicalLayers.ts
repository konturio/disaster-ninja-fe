import type { Action } from '@reatom/core';
import { createBindAtom } from '~utils/atoms';
import { logicalLayersRegistryAtom } from '~core/logical_layers/atoms/logicalLayersRegistry';
import {
  createLogicalLayerAtom,
  LogicalLayerAtom,
} from '~core/logical_layers/createLogicalLayerAtom';
import { layersInAreaResourceAtom, paramsAtom } from './layersInArea';
import { GenericLayer } from '../layers/GenericLayer';
import { createBivariateLayerFromPreset } from '../layers/BivariateLayer';
import { LayerInArea, LayerInAreaReactiveData } from '../types';

type LayersInAreaAtomProps = {
  loading: boolean;
  data?: LayerInArea[] | null;
  error: unknown;
};

function wrapInLogicalLayer(layer: LayerInArea, initialData) {
  if (layer.legend?.type === 'bivariate') {
    return createLogicalLayerAtom(createBivariateLayerFromPreset(layer));
  } else {
    // TODO: Check layer flags and subscribe only to data that required
    // Wait unit #8421 was merged
    const genericLayer = new GenericLayer(layer, initialData);
    return createLogicalLayerAtom(genericLayer);
  }
}

export const layersInAreaLogicalLayersAtom = createBindAtom(
  {
    layersInAreaResourceAtom,
  },
  ({ onChange, schedule, getUnlistedState }) => {
    onChange(
      'layersInAreaResourceAtom',
      (
        nextData: LayersInAreaAtomProps,
        prevData: LayersInAreaAtomProps | null,
      ) => {
        if (nextData.loading) return null;
        const { data: nextLayers } = nextData;
        const { data: prevLayers } = prevData ?? {};
        const allLayers = new Set([
          ...(nextLayers ?? []).map((l) => l.id),
          ...(prevLayers ?? []).map((l) => l.id),
        ]);

        /* Create diff */
        const nextMap = new Map(nextLayers?.map((l) => [l.id, l]));
        const prevSet = new Set(prevLayers?.map((l) => l.id));
        const [added, removed, unchanged] = Array.from(allLayers).reduce(
          (acc, layerId) => {
            if (nextMap.has(layerId) && !prevSet.has(layerId)) {
              acc[0].set(layerId, nextMap.get(layerId)!);
            } else if (prevSet.has(layerId) && !nextMap.has(layerId)) {
              acc[1].add(layerId);
            } else {
              acc[2].set(layerId, nextMap.get(layerId)!);
            }
            return acc;
          },
          [
            new Map<string, LayerInArea>(),
            new Set<string>(),
            new Map<string, LayerInArea>(),
          ],
        );

        /**
         * Most layers require some dynamic data
         * For example: eventId and geometry for /details request
         */
        const requestParams = getUnlistedState(paramsAtom);
        const actions: Action[] = [];

        /**
         * Create new logical layers for new layers
         * and register them
         */
        const newLogicalLayers = Array.from(added).map(([layerId, layer]) => {
          // Initial data. Same data as passed .setData
          const dynamicLayerData: LayerInAreaReactiveData = {
            layer,
            requestParams,
          };
          const logicalLayer = wrapInLogicalLayer(layer, dynamicLayerData);
          return logicalLayer;
        });
        actions.push(logicalLayersRegistryAtom.registerLayer(newLogicalLayers));

        /* Unregister removed layers */
        actions.push(
          logicalLayersRegistryAtom.unregisterLayer(Array.from(removed)),
        );

        /* Update data for layers was still there */
        const logicalLayersInRegistry = getUnlistedState(
          logicalLayersRegistryAtom,
        );

        unchanged.forEach((layerInArea, layerId) => {
          const logicalLayer = logicalLayersInRegistry[layerId];
          const dynamicLayerData: LayerInAreaReactiveData = {
            layer: layerInArea,
            requestParams,
          };
          actions.push(logicalLayer.setData(dynamicLayerData));
        });

        /* Batch actions into one transaction */
        if (actions.length) {
          schedule((dispatch) => {
            dispatch(actions);
          });
        }
      },
    );
  },
  'layersInAreaLogicalLayers',
);
