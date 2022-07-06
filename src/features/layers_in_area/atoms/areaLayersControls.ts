import { createAtom } from '~utils/atoms/createPrimitives';
import { layersRegistryAtom } from '~core/logical_layers/atoms/layersRegistry';
import { getLayerRenderer } from '~core/logical_layers/utils/getLayerRenderer';
import { createUpdateActionsFromLayersDTO } from '../utils/createUpdateActionsFromLayersDTO';
import { areaLayersListResource } from './areaLayersListResource';
import type { LayerInArea } from '../types';
import type { Action } from '@reatom/core';

/**
 * This atom responsibilities:
 * 1. Find a diff between old layer in area list and new
 * 2.1 Unregister missing layers
 * 2.2 Create and register new layers
 * 3. Set area layers legends, meta and settings
 */
export const areaLayersControlsAtom = createAtom(
  {
    areaLayersResourceAtom: areaLayersListResource,
  },
  ({ onChange, schedule, getUnlistedState }) => {
    onChange('areaLayersResourceAtom', (nextData, prevData) => {
      /* Prepare data */
      if (nextData.loading) return null;
      const { data: nextLayers } = nextData;
      const { data: prevLayers } = prevData ?? {};
      const allLayers = new Set([
        ...(nextLayers ?? []).map((l) => l.id),
        ...(prevLayers ?? []).map((l) => l.id),
      ]);

      /* Find diff */
      const nextMap = new Map(nextLayers?.map((l) => [l.id, l]));
      const prevSet = new Set(prevLayers?.map((l) => l.id));
      const [added, removed, updated] = Array.from(allLayers).reduce(
        (acc, layerId) => {
          if (nextMap.has(layerId) && !prevSet.has(layerId)) {
            acc[0].set(layerId, nextMap.get(layerId)!);
          } else if (prevSet.has(layerId) && !nextMap.has(layerId)) {
            acc[1].add(layerId);
          } else if (nextMap.has(layerId) && prevSet.has(layerId)) {
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

      const actions: Action[] = [];

      /* Update layers */
      const layerUpdateActions = Array.from(updated).reduce(
        (acc, [layerId, layer]) => {
          const [updateActions] = createUpdateActionsFromLayersDTO(
            layerId,
            layer,
          );
          acc.push(...updateActions);
          return acc;
        },
        [] as Action[],
      );

      actions.push(...layerUpdateActions);

      /* Register added layers */
      const layerRegisterActions = Array.from(added).reduce(
        (acc, [layerId, layer]) => {
          const [updateActions, cleanUpActions] =
            createUpdateActionsFromLayersDTO(layerId, layer);
          acc.push(...updateActions);
          acc.push(
            layersRegistryAtom.register({
              id: layerId,
              renderer: getLayerRenderer(layer),
              cleanUpActions,
              layerWasDrawnCallback: () => {
                // eslint-disable-next-line
                console.log(
                  '%c⧭ layerWasDrawnCallback for ',
                  'color: #d0bfff',
                  layerId,
                );
              },
            }),
          );
          return acc;
        },
        [] as Action[],
      );

      actions.push(...layerRegisterActions);

      /* Unregister removed layers */
      const layersRegistry = getUnlistedState(layersRegistryAtom);
      // Check that we not remove it optimistically by manual unregister call
      const layerIdsToRemove = Array.from(removed).filter((lrId) =>
        layersRegistry.has(lrId),
      );
      if (layerIdsToRemove.length) {
        actions.push(
          layersRegistryAtom.unregister(layerIdsToRemove, {
            notifyLayerAboutDestroy: true,
          }),
        );
      }

      /* Batch actions into one transaction */
      if (actions.length) {
        schedule((dispatch) => {
          dispatch(actions);
        });
      }
    });
  },
  'areaLayersControlsAtom',
);
