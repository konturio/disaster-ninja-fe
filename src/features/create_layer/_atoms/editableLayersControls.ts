import { Action } from '@reatom/core';
import { createAtom } from '~utils/atoms/createPrimitives';
import { layersSettingsAtom } from '~core/logical_layers/atoms/layersSettings';
import { editableLayersResourceAtom } from './editableLayers';
import { LayerDTO } from '../types';

// export function createLayerActionsFromLayerInArea(
//   layerId: string,
//   layer: LayerInArea,
//   options = { registration: true },
// ): Action[] {
//   const actions: Action[] = [];
//   const cleanUpActions: Action[] = [];

//   // Setup meta
//   actions.push(
//     layersMetaAtom.set(layerId, {
//       isLoading: false,
//       error: null,
//       data: {
//         description: layer.description,
//         copyrights: layer.copyrights,
//       },
//     }),
//   );
//   cleanUpActions.push(layersMetaAtom.delete(layerId));

//   // Setup settings
//   actions.push(
//     layersSettingsAtom.set(layerId, {
//       isLoading: false,
//       error: null,
//       data: {
//         id: layerId,
//         name: layer.name,
//         category: layer.category,
//         group: layer.group,
//         boundaryRequiredForRetrieval:
//           layer.boundaryRequiredForRetrieval ?? false,
//         ownedByUser: layer.ownedByUser,
//       },
//     }),
//   );
//   cleanUpActions.push(layersSettingsAtom.delete(layerId));

//   /**
//    * Sources and legends will added later in areaLayersDetails atom
//    * I'am add cleanup actions here, because it only way right now
//    * TODO: Add action to registry for extend clean effect, or auto-cleanup it
//    *  */
//   //
//   cleanUpActions.push(layersLegendsAtom.delete(layerId));
//   cleanUpActions.push(layersSourcesAtom.delete(layerId));

//   // Register
//   if (options.registration) {
//     actions.push(
//       layersRegistryAtom.register({
//         id: layerId,
//         renderer: getLayerRenderer(layer),
//         cleanUpActions,
//       }),
//     );
//   }

//   return actions;
// }

export const editableLayersControls = createAtom(
  {
    editableLayersResourceAtom,
  },
  ({ onChange, schedule }) => {
    onChange('editableLayersResourceAtom', (nextData, prevData) => {
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
          new Map<string, LayerDTO>(),
          new Set<string>(),
          new Map<string, LayerDTO>(),
        ],
      );

      const actions: Action[] = [];

      /* Update layers */
      const [updateActions, cleanUpActions] = createUpdateLayerActions(
        layerId,
        {
          legend,
          meta,
          source,
        },
      );

      const layerUpdateActions = Array.from(updated).reduce(
        (acc, [layerId, layer]) => {
          acc.push(
            ...createLayerActionsFromLayerInArea(layerId, layer, {
              registration: false,
            }),
          );
          return acc;
        },
        [] as Action[],
      );

      actions.push(...layerUpdateActions);

      /* Register added layers */
      const layerRegisterActions = Array.from(added).reduce(
        (acc, [layerId, layer]) => {
          acc.push(...createLayerActionsFromLayerInArea(layerId, layer));
          return acc;
        },
        [] as Action[],
      );

      actions.push(...layerRegisterActions);

      /* Unregister removed layers */
      actions.push(
        layersRegistryAtom.unregister(Array.from(removed), {
          notifyLayerAboutDestroy: true,
        }),
      );

      /* Batch actions into one transaction */
      if (actions.length) {
        schedule((dispatch) => {
          dispatch(actions);
        });
      }
    });
  },
  'editableLayersControls',
);
