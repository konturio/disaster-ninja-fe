import { Action } from '@reatom/core';
import isPromise from 'is-promise';
import { ApplicationMap } from '~components/ConnectedMap/ConnectedMap';
import type { LogicalLayer, LogicalLayerAtomState } from './types';
import { getRivalsLayersUnmountActions } from './logicalLayerRivals';

export const logicalLayerReducer = <T>(
  map: ApplicationMap | undefined,
  layer: LogicalLayer<T>,
  { onAction, schedule, create },
  state: LogicalLayerAtomState & {
    layer: LogicalLayer<T>;
  },
) => {
  onAction('init', () => {
    const stateUpdate = layer.onInit() || {};
    state = {
      ...state,
      isVisible: stateUpdate.isVisible ?? state.isVisible,
      isLoading: stateUpdate.isLoading ?? state.isLoading,
    };
  });

  onAction('register', () => {
    if (!map) return;
    if (typeof layer.wasAddInRegistry !== 'function') {
      return;
    }
    layer.wasAddInRegistry(map);
  });

  onAction('unregister', () => {
    if (!map) return;
    if (typeof layer.wasRemoveFromInRegistry !== 'function') {
      return;
    }
    layer.wasRemoveFromInRegistry(map);
  });

  onAction('hide', () => {
    if (!map) return;
    if (typeof layer.willHide !== 'function') {
      console.error(`Layer '${state.id}' not implement willHide method`);
      return;
    }
    layer.willHide(map);
    state = { ...state, isVisible: false };
  });

  onAction('unhide', () => {
    if (!map) return;
    if (typeof layer.willUnhide !== 'function') {
      console.error(`Layer '${state.id}' not implement willUnhide method`);
      return;
    }
    layer.willUnhide(map);
    state = { ...state, isVisible: true };
  });

  onAction('download', () => {
    if (!map || !layer.isDownloadable) return;
    if (typeof layer.onDownload !== 'function') {
      console.error(`Layer '${state.id}' haven't implemented onDownload method`);
      return;
    }
    layer.onDownload(map);
  });


  onAction('mount', () => {
    state = { ...state, isLoading: true, isMounted: true, isError: false };
    if (!map) return;
    schedule((dispatch) => {
      const doMount = async () => {
        const actions: Action[] = [];
        const maybePromise = layer.willMount(map);
        if (isPromise(maybePromise)) {
          const stateUpdate = {
            isLoading: false,
            isError: false,
            isMounted: true,
          };
          try {
            await maybePromise;
          } catch (e) {
            stateUpdate.isError = true;
            stateUpdate.isMounted = false;
            console.error(e);
          } finally {
            const updateStateAction = create('_updateState', stateUpdate);
            actions.push(updateStateAction);
          }
        } else {
          const updateStateAction = create('_updateState', {
            isLoading: false,
          });
          actions.push(updateStateAction);
        }
        // Add actions for unmount rivals
        getRivalsLayersUnmountActions(state.id).forEach((action) => {
          actions.push(action);
        });
        if (actions.length) dispatch(actions);
      };
      // Trigger mount after map loaded
      if (map.isStyleLoaded()) {
        doMount();
      } else {
        map.once('idle', () => doMount());
      }
    });
  });

  onAction('unmount', () => {
    if (!map) return;
    const maybePromise = layer.willUnmount(map);
    if (isPromise(maybePromise)) {
      state = { ...state, isLoading: true };
      schedule((dispatch) => {
        let isSuccess = false;
        maybePromise
          .then(() => (isSuccess = true))
          .finally(() => {
            const updateStateAction = create('_updateState', {
              isLoading: false,
              isVisible: true,
              isMounted: !isSuccess,
              isError: !isSuccess,
            });
            dispatch(updateStateAction);
          });
      });
    } else {
      state = { ...state, isMounted: false, isVisible: true, };
    }
  });

  onAction('_updateState', (update) => {
    state = {
      ...state,
      isLoading: update.isLoading ?? state.isLoading,
      isMounted: update.isMounted ?? state.isMounted,
      isVisible: update.isVisible ?? state.isVisible,
      isError: update.isError ?? state.isError,
    };
  });

  return state;
};
