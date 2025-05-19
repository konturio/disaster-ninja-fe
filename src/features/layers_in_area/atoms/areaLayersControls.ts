import { createAtom } from '~utils/atoms/createPrimitives';
import { layersRegistryAtom } from '~core/logical_layers/atoms/layersRegistry';
import { getLayerRenderer } from '~core/logical_layers/utils/getLayerRenderer';
import { createUpdateActionsFromLayersDTO } from '~core/logical_layers/utils/createUpdateActionsFromLayersDTO';
import { editableLayersListResource } from '~features/create_layer/atoms/editableLayersListResource';
import { layersInAreaAndEventLayerResource } from './layersInAreaAndEventLayerResource';
import { layersGlobalResource } from './layersGlobalResource';
import type { LayerSummaryDto } from '~core/logical_layers/types/source';
import type { Action } from '@reatom/core-v2';

const allLayers = createAtom(
  {
    layersGlobalResource,
    layersInAreaAndEventLayerResource,
    editableLayersListResource,
  },
  ({ get }) => {
    return [
      ...(get('layersGlobalResource').data ?? []),
      ...(get('layersInAreaAndEventLayerResource').data ?? []),
      ...(get('editableLayersListResource').data ?? []),
    ];
  },
  'allLayers',
);

/**
 * This atom responsibilities:
 * 1. Find a diff between old layer in area list and new
 * 2.1 Unregister missing layers
 * 2.2 Create and register new layers
 * 3. Set area layers legends, meta and settings
 */
export const areaLayersControlsAtom = createAtom(
  {
    allLayers,
  },
  ({ onChange, schedule, getUnlistedState }) => {
    onChange('allLayers', (nextLayers, prevLayers) => {
      /* Prepare data */
      const allLayers = new Set([
        ...nextLayers.map((l) => l.id),
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
          new Map<string, LayerSummaryDto>(),
          new Set<string>(),
          new Map<string, LayerSummaryDto>(),
        ],
      );

      const actions: Action[] = [];

      /* Update layers */
      const [updateLayersSubAtoms] = createUpdateActionsFromLayersDTO(
        Array.from(updated),
      );
      actions.push(...updateLayersSubAtoms);

      /* Register added layers */
      const [setupLayersSubAtoms, cleanUpActions] = createUpdateActionsFromLayersDTO(
        Array.from(added),
      );
      actions.push(...setupLayersSubAtoms);

      const registerLayers = Array.from(added).map(([layerId, layer]) => ({
        id: layerId,
        renderer: getLayerRenderer(layer),
        cleanUpActions,
      }));
      if (registerLayers.length) {
        actions.push(layersRegistryAtom.register(registerLayers));
      }

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
