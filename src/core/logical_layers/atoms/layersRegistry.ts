import type { Action } from '@reatom/core';
import { createAtom } from '~utils/atoms/createPrimitives';
import { createLogicalLayerAtom } from '../utils/logicalLayerFabric';
import { hiddenLayersAtom } from './hiddenLayers';
import { mountedLayersAtom } from './mountedLayers';
import type { LayerAtom } from '../types/logicalLayer';
import type { RegisterRequest, LayerRegistryAtom } from '../types/registry';

/**
 * Register responsibilities:
 * 1. Create layer atoms
 * 2. Cleanup side-states when layer unregistered
 * */
const cleanUpActionsMap = new WeakMap<LayerAtom, Action[]>();

export const layersRegistryAtom: LayerRegistryAtom = createAtom(
  {
    register: (r: RegisterRequest | RegisterRequest[]) =>
      Array.isArray(r) ? r : [r],
    unregister: (
      id: string | string[],
      { notifyLayerAboutDestroy }: { notifyLayerAboutDestroy?: boolean } = {},
    ) => ({ ids: Array.isArray(id) ? id : [id], notifyLayerAboutDestroy }),
    _delete: (id: string | string[]) => (Array.isArray(id) ? id : [id]),
  },
  ({ onAction, create, schedule }, state = new Map<string, LayerAtom>()) => {
    onAction('register', (requests) => {
      const newState = new Map(state);
      requests.forEach(({ id, renderer, cleanUpActions }) => {
        const layerAtom = createLogicalLayerAtom(
          id,
          renderer,
          layersRegistryAtom,
        );
        newState.set(id, layerAtom);
        if (cleanUpActions) {
          cleanUpActionsMap.set(layerAtom, cleanUpActions);
        }
      });
      state = newState;
    });

    /**
     * Clean up:
     * Registry call this event when layer about to not available anymore.
     * For avoid state inconsistency, you must clean sub-states atoms here in one transaction
     */
    onAction('unregister', ({ ids, notifyLayerAboutDestroy }) => {
      ids.forEach((id) => {
        const layerAtom = state.get(id);
        if (layerAtom) {
          schedule((dispatch) => {
            const actions: Action[] = [
              ...(cleanUpActionsMap.get(layerAtom) || []),
              /* Not clear enabledLayersAtom, because it store only user choices,
               * and we want to store it even when layer unavailable */
              mountedLayersAtom.delete(id),
              hiddenLayersAtom.delete(id),
              /**
               * notifyLayerAboutDestroy == false means that
               * this action called from inside layerAtom.destroy()
               * and not needed to cal it again
               */
              notifyLayerAboutDestroy && layerAtom.destroy(),
              /* Delete layer from registry in one transaction with other states */
              create('_delete', id),
            ].filter((i): i is Action => Boolean(i));
            dispatch(actions);
          });
        } else {
          console.error(`Attempt unregister not existing layer with id: ${id}`);
        }
      });
    });

    onAction('_delete', (ids) => {
      const newState = new Map(state);
      ids.forEach((id) => {
        newState.delete(id);
      });
      state = newState;
    });

    return state;
  },
  'layersRegistry',
);
