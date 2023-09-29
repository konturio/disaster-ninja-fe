import { createAtom } from '~utils/atoms/createPrimitives';
import { i18n } from '~core/localization';
import { layersRegistryAtom } from '~core/logical_layers/atoms/layersRegistry';
import { getLayerRenderer } from '~core/logical_layers/utils/getLayerRenderer';
import { createUpdateLayerActions } from '~core/logical_layers/utils/createUpdateActions';
import { createUpdateActionsFromLayersDTO } from '~core/logical_layers/utils/createUpdateActionsFromLayersDTO';
import { forceRun } from '~utils/atoms/forceRun';
import { createLayerController } from '../control';
import { editableLayersListResource } from './editableLayersListResource';
import { editableLayerControllerAtom } from './editableLayerController';
import { featurePanelControllerAtom } from './featurePanelController';
import type { EditableLayers } from '../types';
import type { Action } from '@reatom/core';

/**
 * This atom load user layers
 * For every new layer it create logical layer atom,
 * and logical layers sub-atoms like, meta and settings.
 * And unregister logical layers for removed layers
 */
export const editableLayersControlsAtom = createAtom(
  {
    editableLayersListResource,
  },
  ({ onChange, schedule }) => {
    onChange('editableLayersListResource', (nextData, prevData) => {
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
          new Map<string, EditableLayers>(),
          new Set<string>(),
          new Map<string, EditableLayers>(),
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

      /* Add context menus */
      const layerContextMenusActions = createUpdateLayerActions(
        Array.from(added).map(([layerId, layer]) => ({
          id: layerId,
          menu: [
            {
              id: 'edit_layer',
              name: i18n.t('create_layer.edit_layer'),
              callback: () => editableLayerControllerAtom.editLayer.dispatch(layerId),
            },
            {
              id: 'edit_features',
              name: i18n.t('create_layer.edit_features'),
              callback: () => featurePanelControllerAtom.editFeatures.dispatch(layerId),
            },
            {
              id: 'delete_layer',
              name: i18n.t('create_layer.delete_layer'),
              callback: () => editableLayerControllerAtom.deleteLayer.dispatch(layerId),
            },
          ],
        })),
      ).flat();
      actions.push(...layerContextMenusActions);

      /* Unregister removed layers */
      if (removed.size) {
        actions.push(
          layersRegistryAtom.unregister(Array.from(removed), {
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
  'editableLayersControlsAtom',
);

createLayerController.onInit(() => forceRun(editableLayersControlsAtom));
