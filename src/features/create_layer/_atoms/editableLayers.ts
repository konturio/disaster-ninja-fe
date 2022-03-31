import { Action } from '@reatom/core';
import { createResourceAtom } from '~utils/atoms/createResourceAtom';
import { createAtom } from '~utils/atoms/createPrimitives';
import {
  FocusedGeometry,
  focusedGeometryAtom,
} from '~core/shared_state/focusedGeometry';
import { layersRegistryAtom } from '~core/logical_layers/atoms/layersRegistry';
import { layersLegendsAtom } from '~core/logical_layers/atoms/layersLegends';
import { layersMetaAtom } from '~core/logical_layers/atoms/layersMeta';
import { layersSettingsAtom } from '~core/logical_layers/atoms/layersSettings';
import { apiClient } from '~core/index';
import { LayerDTO } from '../types';
import { layersSourcesAtom } from '~core/logical_layers/atoms/layersSources';
import {
  UpdateCallbackLayersLoading,
  UpdateCallbackLayersType,
  updateCallbackService,
} from '~core/update_callbacks';
import {
  currentApplicationAtom,
  currentEventFeedAtom,
} from '~core/shared_state';
import { getLayerRenderer } from '~core/logical_layers/utils/getLayerRenderer';
import { layersUserDataAtom } from '~core/logical_layers/atoms/layersUserData';
import { EDITABLE_LAYERS_GROUP } from '~core/constants';

const editableLayersDependencyAtom = createAtom(
  { currentApplicationAtom },
  (
    { onChange, getUnlistedState },
    state: { appId: string | null } = { appId: null },
  ) => {
    onChange('currentApplicationAtom', (focusedGeometry) => {
      const appId = getUnlistedState(currentApplicationAtom);
      state = { appId };
    });
    return state;
  },
);

export const editableLayersResourceAtom = createResourceAtom(async (params) => {
  const body: {
    appId?: string;
  } = {};

  if (params?.appId) {
    body.appId = params.appId;
  } else {
    return null;
  }

  const responseData = await apiClient.post<LayerDTO[]>(
    '/layers/search/',
    body,
    true,
  );
  if (responseData === undefined) throw new Error('No data received');
  // ! Right now only user layers can be edited !
  return responseData.filter((l) => l.group === EDITABLE_LAYERS_GROUP);
}, editableLayersDependencyAtom);

/**
 * This atom responsibilities:
 * 1. Find a diff between old layer in area list and new
 * 2.1 Unregister missing layers
 * 2.2 Create and register new layers
 * 3. Set area layers legends, meta and settings
 */
export const editableLayers = createAtom(
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
          new Map<string, LayerInArea>(),
          new Set<string>(),
          new Map<string, LayerInArea>(),
        ],
      );

      const actions: Action[] = [];

      /* Update layers */
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
  'layersInAreaLogicalLayers',
);

export function createLayerActionsFromLayerInArea(
  layerId: string,
  layer: LayerInArea,
  options = { registration: true },
): Action[] {
  const actions: Action[] = [];
  const cleanUpActions: Action[] = [];

  // Setup user data
  if (layer.group === UserLayerGroup) {
    actions.push(
      layersUserDataAtom.set(layerId, {
        isLoading: false,
        error: null,
        data: {
          name: layer.name,
          featureProperties: layer.featureProperties || {},
        },
      }),
    );
    cleanUpActions.push(layersUserDataAtom.delete(layerId));
  }

  return actions;
}
