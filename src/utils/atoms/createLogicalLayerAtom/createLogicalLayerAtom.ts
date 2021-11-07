import { Atom, createAtom } from '@reatom/core';
import isPromise from 'is-promise';
import { currentMapAtom } from '~core/shared_state/currentMap';
import { ApplicationMap } from '~components/ConnectedMap/ConnectedMap';

type LogicalLayerAtomState = {
  isMounted: boolean;
  isVisible: boolean;
  isLoading: boolean;
};

export interface LogicalLayer<T = null> {
  id: string;
  name?: string;
  onInit(): { isVisible?: boolean; isLoading?: boolean } | void;
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
    state: LogicalLayerAtomState,
  ) => void;
}

const defaultReducer = <T>(
  map: ApplicationMap | undefined,
  layer: LogicalLayer<T>,
  { onAction, schedule, create },
  state: {
    id: string;
    layer: LogicalLayer<T>;
    isMounted: boolean;
    isVisible: boolean;
    isLoading: boolean;
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
      console.error(
        `Layer '${state.id}' not implement wasAddInRegistry method`,
      );
      return;
    }
    layer.wasAddInRegistry(map);
  });

  onAction('unregister', () => {
    if (!map) return;
    if (typeof layer.wasRemoveFromInRegistry !== 'function') {
      console.error(
        `Layer '${state.id}' not implement wasRemoveFromInRegistry method`,
      );
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
};

export function createLogicalLayerAtom<T>(
  layer: LogicalLayer<T>,
  atom?: Atom<T>,
) {
  return atom
    ? createAtom(
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
          }: {
            isLoading?: boolean;
            isMounted?: boolean;
            isVisible?: boolean;
          }) => ({ isLoading, isMounted, isVisible }),
        },
        (
          track,
          state = {
            id: layer.id,
            layer,
            isMounted: false,
            isVisible: true,
            isLoading: false,
          },
        ) => {
          const { get, onChange } = track;
          const map = get('map');
          defaultReducer(map, layer, track, state);
          onChange('data', (data) => {
            if (!map) return;
            if (typeof layer.onDataChange === 'function') {
              const { isLoading, isMounted, isVisible } = state;
              layer.onDataChange(map, data, {
                isLoading,
                isMounted,
                isVisible,
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
    : createAtom(
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
          }: {
            isLoading?: boolean;
            isMounted?: boolean;
            isVisible?: boolean;
          }) => ({ isLoading, isMounted, isVisible }),
        },
        (
          track,
          state = {
            id: layer.id,
            layer,
            isMounted: false,
            isVisible: true,
            isLoading: false,
          },
        ) => {
          const { get, onAction } = track;
          const map = get('map');
          defaultReducer(map, layer, track, state);
          onAction('setData', (data) => {
            if (!map) return;
            if (typeof layer.onDataChange === 'function') {
              const { isLoading, isMounted, isVisible } = state;
              layer.onDataChange(map, data, {
                isLoading,
                isMounted,
                isVisible,
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
