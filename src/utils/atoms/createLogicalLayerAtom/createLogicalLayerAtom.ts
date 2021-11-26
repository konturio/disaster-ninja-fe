import { Atom } from '@reatom/core';
import { createBindAtom } from '~utils/atoms/createBindAtom';
import isPromise from 'is-promise';
import { currentMapAtom } from '~core/shared_state';
import { ApplicationMap } from '~components/ConnectedMap/ConnectedMap';
import { LayerLegend } from '.';

export type LogicalLayerAtomState = {
  id: string;
  isMounted: boolean;
  isVisible: boolean;
  isLoading: boolean;
  isError: boolean;
};

export interface LogicalLayer<T = null> {
  id: string;
  name?: string;
  legend?: LayerLegend;
  description?: string;
  copyright?: string;
  onInit(): { isVisible?: boolean; isLoading?: boolean };
  willMount(map: ApplicationMap): void | Promise<unknown>;
  willUnmount(map: ApplicationMap): void | Promise<unknown>;
  willHide?: (map: ApplicationMap) => void;
  willUnhide?: (map: ApplicationMap) => void;
  wasAddInRegistry?: (
    map: ApplicationMap,
  ) => { isVisible?: boolean; isLoading?: boolean } | void;
  wasRemoveFromInRegistry?: (
    map: ApplicationMap,
  ) => { isVisible?: boolean; isLoading?: boolean } | void;
  onDataChange?: (
    map: ApplicationMap,
    data: T,
    state: Omit<LogicalLayerAtomState, 'id'>,
  ) => void;
}

const defaultReducer = <T>(
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

  onAction('mount', () => {
    state = { ...state, isLoading: true, isMounted: true, isError: false };
    if (!map) return;
    schedule((dispatch) => {
      const doMount = () => {
        const maybePromise = layer.willMount(map);
        if (isPromise(maybePromise)) {
          const stateUpdate = {
            isLoading: false,
            isError: false,
            isMounted: true,
          };
          maybePromise
            .catch((e) => {
              stateUpdate.isError = true;
              stateUpdate.isMounted = false;
              console.error(e);
            })
            .finally(() => {
              const updateStateAction = create('_updateState', stateUpdate);
              dispatch(updateStateAction);
            });
        } else {
          const updateStateAction = create('_updateState', {
            isLoading: false,
          });
          dispatch(updateStateAction);
        }
      };
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
              isMounted: !isSuccess,
              isError: !isSuccess,
            });
            dispatch(updateStateAction);
          });
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
      isError: update.isError ?? state.isError,
    };
  });

  return state;
};

export function createLogicalLayerAtom<T>(
  layer: LogicalLayer<T>,
  atom?: Atom<T>,
) {
  return atom
    ? createBindAtom(
        {
          data: atom,
          map: currentMapAtom,
          init: () => undefined,
          mount: () => undefined,
          unmount: () => undefined,
          hide: () => undefined,
          unhide: () => undefined,
          register: () => undefined,
          unregister: () => undefined,
          _updateState: ({
            isLoading,
            isMounted,
            isVisible,
            isError,
          }: Partial<LogicalLayerAtomState>) => ({
            isLoading,
            isMounted,
            isVisible,
            isError,
          }),
        },
        (
          track,
          state = {
            id: layer.id,
            layer,
            isMounted: false,
            isVisible: true,
            isLoading: false,
            isError: false,
          },
        ) => {
          const { get, onChange } = track;
          const map = get('map');
          state = defaultReducer(map, layer, track, state);
          onChange('data', (data) => {
            if (!map) return;
            if (typeof layer.onDataChange === 'function') {
              const { isLoading, isMounted, isVisible, isError } = state;
              layer.onDataChange(map, data, {
                isLoading,
                isMounted,
                isVisible,
                isError,
              });
              return;
            } else {
              console.error(
                `Layer '${state.id}' not implement onGeometryChange method`,
              );
            }
          });
          return state;
        },
        layer.id,
      )
    : createBindAtom(
        {
          map: currentMapAtom,
          setData: (data: T) => data,
          init: () => undefined,
          mount: () => undefined,
          unmount: () => undefined,
          hide: () => undefined,
          unhide: () => undefined,
          register: () => undefined,
          unregister: () => undefined,
          _updateState: ({
            isLoading,
            isMounted,
            isVisible,
            isError,
          }: {
            isLoading?: boolean;
            isMounted?: boolean;
            isVisible?: boolean;
            isError?: boolean;
          }) => ({ isLoading, isMounted, isVisible, isError }),
        },
        (
          track,
          state = {
            id: layer.id,
            layer,
            isMounted: false,
            isVisible: true,
            isLoading: false,
            isError: false,
          },
        ) => {
          const { get, onAction } = track;
          const map = get('map');
          state = defaultReducer(map, layer, track, state);
          onAction('setData', (data) => {
            if (!map) return;
            if (typeof layer.onDataChange === 'function') {
              const { isLoading, isMounted, isVisible, isError } = state;
              layer.onDataChange(map, data, {
                isLoading,
                isMounted,
                isVisible,
                isError,
              });
              return;
            } else {
              console.error(
                `Layer '${state.id}' not implement onGeometryChange method`,
              );
            }
          });
          return state;
        },
        layer.id,
      );
}

// Dirty hack for fixing TS typed infer
// https://stackoverflow.com/questions/50321419/typescript-returntype-of-generic-function
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const wrapper = (x: any, y: any) => createLogicalLayerAtom<any>(x, y);
export type LogicalLayerAtom = ReturnType<typeof wrapper>;
