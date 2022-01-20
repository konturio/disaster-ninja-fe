import { Atom } from '@reatom/core';
import { createBindAtom } from '~utils/atoms/createBindAtom';
import { currentMapAtom } from '~core/shared_state';
import { LogicalLayer, LogicalLayerAtomState } from './types';
import { logicalLayerReducer } from './logicalLayerReducer';

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
          download: () => undefined,
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
          onChange('data', (data) => {
            if (typeof layer.onDataChange === 'function') {
              const { isLoading, isMounted, isVisible, isError } = state;
              layer.onDataChange(map ?? null, data, {
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
          state = logicalLayerReducer(map, layer, track, state);

          return state;
        },
        layer.id,
      )
    : createBindAtom(
        {
          map: currentMapAtom,
          setData: (data: T) => data,
          download: () => undefined,
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
          state = logicalLayerReducer(map, layer, track, state);
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
