import { Action } from '@reatom/core';
import { createAtom } from '~utils/atoms/createPrimitives';
import { TranslationService as i18n } from '~core/localization';
import { layersRegistryAtom } from '~core/logical_layers/atoms/layersRegistry';
import { getLayerRenderer } from '~core/logical_layers/utils/getLayerRenderer';
import { createUpdateLayerActions } from '~core/logical_layers/utils/createUpdateActions';
import { createUpdateActionsFromLayersDTO } from '../utils/createUpdateActionsFromLayersDTO';
import { EditableLayers } from '../types';
import { editableLayersListResource } from './editableLayersListResource';
import { editableLayerControllerAtom } from './editableLayerController';
import { featurePanelControllerAtom } from './featurePanelController';

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
            }),
          );
          return acc;
        },
        [] as Action[],
      );

      actions.push(...layerRegisterActions);

      /* Add context menus */
      const layerContextMenusActions = Array.from(added)
        .map(([layerId]) => {
          const [updateActions] = createUpdateLayerActions(layerId, {
            menu: [
              {
                id: 'edit_layer',
                name: i18n.t('Edit Layer'),
                callback: () =>
                  editableLayerControllerAtom.editLayer.dispatch(layerId),
              },
              {
                id: 'edit_features',
                name: i18n.t('Edit Features'),
                callback: () =>
                  featurePanelControllerAtom.editFeatures.dispatch(layerId),
              },
              {
                id: 'delete_layer',
                name: i18n.t('Delete Layer'),
                callback: () =>
                  editableLayerControllerAtom.deleteLayer.dispatch(layerId),
              },
            ],
          });
          return updateActions;
        })
        .flat();

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
