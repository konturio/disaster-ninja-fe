import { Action, AtomSelfBinded, Atom } from '@reatom/core';
import { createBindAtom } from '~utils/atoms/createBindAtom';
import { currentMapAtom } from '~core/shared_state';
import {
  LogicalLayer,
  LogicalLayerAtomState,
  LogicalLayerAtomActions,
} from './types';
import { currentHiddenLayersAtom } from '../atoms/currentHiddenLayers';
import { currentMountedLayersAtom } from '../atoms/currentMountedLayers';
import { getRivalsLayersUnmountActions as unmountConcurrentLayers } from './logicalLayerRivals';
import { enabledLayersAtom } from '~core/shared_state';
import { doMount } from './mountingProcess';
import { doUnmount } from './unmountingProcess';

export type LogicalLayerAtom = AtomSelfBinded<
  LogicalLayerAtomState,
  LogicalLayerAtomActions<never>
>;

function isStateChanged(
  before: LogicalLayerAtomState,
  after: LogicalLayerAtomState,
) {
  let isChanged = false;
  for (const k in before) {
    if (!Object.is(before[k], after[k])) {
      isChanged = true;
      break;
    }
  }
  return isChanged;
}

export function createLogicalLayerAtom<T>(
  layer: LogicalLayer<T>,
  atom?: AtomSelfBinded | Atom,
): LogicalLayerAtom {
  const actions: LogicalLayerAtomActions<T> = {
    init: () => undefined,
    mount: () => undefined,
    unmount: () => undefined,
    hide: () => undefined,
    unhide: () => undefined,
    enable: () => undefined,
    disable: () => undefined,
    register: () => undefined,
    unregister: () => undefined,
    download: () => undefined,
    setData: (data: T) => data,
    _updateState: ({
      isLoading,
      isMounted,
      isVisible,
      isError,
      isEnabled,
    }: Partial<LogicalLayerAtomState>) => ({
      isLoading,
      isMounted,
      isVisible,
      isError,
      isEnabled,
    }),
  };

  const initialState: LogicalLayerAtomState = {
    layer,
    id: layer.id,
    isMounted: false,
    isVisible: true,
    isLoading: false,
    isError: false,
    isEnabled: false,
  };

  const logicalLayerAtom: LogicalLayerAtom = createBindAtom(
    {
      map: currentMapAtom,
      currentMountedLayersAtom,
      currentHiddenLayersAtom,
      enabledLayersAtom,
      ...actions,
    },
    ({ get, onAction, schedule, create }, state = initialState) => {
      const map = get('map');
      const newState = {
        layer,
        id: layer.id,
        isLoading: state.isLoading,
        isError: state.isError,
        isMounted: get('currentMountedLayersAtom').has(state.id),
        isVisible: !get('currentHiddenLayersAtom').has(state.id),
        isEnabled: get('enabledLayersAtom')?.has(state.id) ?? false,
      };

      onAction('_updateState', (update) => {
        for (const k in update) {
          if (update[k] !== undefined) newState[k] = update[k];
        }
      });

      onAction('setData', (data) => {
        if (!map) return;
        if (typeof layer.onDataChange === 'function') {
          const { layer: l, id, ...layerState } = state;
          layer.onDataChange(map, data, layerState);
          return;
        } else {
          console.error(
            `Layer '${state.id}' not implement onGeometryChange method`,
          );
        }
      });

      // Registration

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

      // Enable

      onAction('enable', () => {
        if (layer.willEnabled) {
          const postActions = layer.willEnabled(map) ?? [];
          schedule((dispatch) =>
            dispatch([
              ...postActions,
              enabledLayersAtom.add(state.id),
              create('mount'),
            ]),
          );
        }
        // newState.isEnabled = true;
      });

      onAction('disable', () => {
        if (layer.willDisabled) {
          const postActions = layer.willDisabled(map) ?? [];
          schedule((dispatch) => dispatch([...postActions, create('unmount')]));
        }
        // newState.isEnabled = false;
      });

      // Mount

      onAction('mount', () => {
        newState.isLoading = true;
        newState.isError = false;
        if (!map) return;
        schedule((dispatch) => {
          const runMountProcess = async () => {
            const { isMounted, ...stateUpdate } = await doMount(
              layer.willMount(map),
            );
            // Collect required actions
            const actions = [
              create('_updateState', stateUpdate),
              isMounted &&
                currentMountedLayersAtom.set(state.id, logicalLayerAtom),
              ...unmountConcurrentLayers(state.id),
            ].filter(Boolean) as Action[];

            // Perform update
            actions.length && dispatch(actions);
          };

          if (map.isStyleLoaded()) {
            runMountProcess();
          } else {
            // Wait until app loading
            map.once('idle', () => {
              runMountProcess();
            });
          }
        });
      });

      onAction('unmount', () => {
        console.log('unmount layer', state);
        newState.isLoading = true;
        newState.isError = false;
        if (!map) return;
        schedule((dispatch) => {
          const runUnmountProcess = async () => {
            const { isMounted, ...stateUpdate } = await doUnmount(
              layer.willUnmount(map),
            );
            // Collect required actions
            const actions = [
              create('_updateState', stateUpdate),
              !isMounted && currentMountedLayersAtom.delete(state.id),
            ].filter(Boolean) as Action[];

            // Perform update
            actions.length && dispatch(actions);
          };
          runUnmountProcess();
        });
      });

      // Hide

      onAction('hide', () => {
        if (!map) return;
        if (typeof layer.willHide !== 'function') {
          console.error(`Layer '${state.id}' not implement willHide method`);
          return;
        }
        layer.willHide(map);
        schedule((dispatch) => {
          dispatch(currentHiddenLayersAtom.set(state.id, logicalLayerAtom));
        });
      });

      onAction('unhide', () => {
        if (!map) return;
        if (typeof layer.willUnhide !== 'function') {
          console.error(`Layer '${state.id}' not implement willUnhide method`);
          return;
        }
        layer.willUnhide(map);
        schedule((dispatch) => {
          dispatch(currentHiddenLayersAtom.delete(state.id));
        });
      });

      onAction('download', () => {
        if (!map || !layer.isDownloadable) return;
        if (typeof layer.onDownload !== 'function') {
          console.error(
            `Layer '${state.id}' haven't implemented onDownload method`,
          );
          return;
        }
        layer.onDownload(map);
      });

      return isStateChanged(state, newState) ? newState : state;
    },
    layer.id,
  ) as unknown as LogicalLayerAtom;

  if (atom && 'subscribe' in atom) {
    atom.subscribe((s) => {
      // @ts-ignore
      logicalLayerAtom.setData.dispatch(s);
    });
  }

  return logicalLayerAtom as unknown as LogicalLayerAtom;
}
