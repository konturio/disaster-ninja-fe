import { createAtom } from '@reatom/core';
import isPromise from 'is-promise';
import { currentMapAtom } from '~core/shared_state/currentMap';
import { ApplicationMap } from '~components/ConnectedMap/ConnectedMap';

export interface LogicalLayer {
  id: string;
  name?: string;
  onInit: () => { isVisible: boolean; isLoading: boolean };
  willMount: (map: ApplicationMap) => void | Promise<unknown>;
  willUnmount: (map: ApplicationMap) => void | Promise<unknown>;
  willHide?: (map: ApplicationMap) => void;
  // ? Or willShow
  willUnhide?: (map: ApplicationMap) => void;
}

export const createLogicalLayerAtom = (layer: LogicalLayer) =>
  createAtom(
    {
      map: currentMapAtom,
      init: () => undefined,
      mount: () => undefined,
      unmount: () => undefined,
      hide: () => undefined,
      unhide: () => undefined,
      _updateState: ({
        isLoading,
        isMounted,
        isVisible,
      }: {
        isLoading?: boolean;
        isMounted?: boolean;
        isVisible?: boolean;
      }) => ({ isLoading, isMounted, isVisible }),
    },
    (
      { get, onAction, schedule, create },
      state = { layer, isMounted: false, isVisible: true, isLoading: false },
    ) => {
      const map = get('map');
      onAction('init', () => {
        const { isVisible, isLoading } = layer.onInit();
        state = { ...state, isVisible, isLoading };
      });

      onAction('hide', () => {
        if (!map) return;
        if (typeof layer.willHide !== 'function') return;
        layer.willHide(map);
        state = { ...state, isVisible: false };
      });

      onAction('unhide', () => {
        if (!map) return;
        if (typeof layer.willUnhide !== 'function') return;
        layer.willUnhide(map);
        state = { ...state, isVisible: true };
      });

      onAction('mount', () => {
        if (!map) return;
        const maybePromise = layer.willMount(map);
        if (isPromise(maybePromise)) {
          state = { ...state, isLoading: true };

          schedule((dispatch) => {
            let isSuccess = false;
            maybePromise
              .then(() => (isSuccess = true))
              .finally(() =>
                dispatch(
                  create('_updateState', {
                    isLoading: false,
                    isMounted: isSuccess,
                  }),
                ),
              );
          });
        } else {
          state = { ...state, isMounted: true };
        }
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
              .finally(() =>
                dispatch(
                  create('_updateState', {
                    isLoading: false,
                    isMounted: !isSuccess,
                  }),
                ),
              );
          });
        } else {
          state = { ...state, isMounted: false };
        }
      });
      onAction('_updateState', (update) => {
        state = {
          ...state,
          isLoading: update.isLoading ?? state.isLoading,
          isMounted: update.isMounted ?? state.isMounted,
          isVisible: update.isVisible ?? state.isVisible,
        };
      });

      return state;
    },
    layer.id,
  );
export type LogicalLayerAtom = ReturnType<typeof createLogicalLayerAtom>;
