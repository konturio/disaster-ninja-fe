import { createAtom } from '~utils/atoms';
import { deepCopy } from '~core/logical_layers/utils/deepCopy';
import { drawnGeometryAtom } from './drawnGeometryAtom';
import { activeDrawModeAtom } from './activeDrawMode';
import type { FeatureCollection } from 'geojson';

interface HistoryState {
  past: FeatureCollection[];
  future: FeatureCollection[];
  ignore: boolean;
}

const defaultState: HistoryState = {
  past: [],
  future: [],
  ignore: false,
};

export const drawHistoryAtom = createAtom(
  {
    drawnGeometryAtom,
    activeDrawModeAtom,
    undo: () => null,
    redo: () => null,
    reset: () => null,
  },
  (
    { onChange, onAction, schedule, getUnlistedState },
    state: HistoryState = defaultState,
  ) => {
    onChange('activeDrawModeAtom', (mode, prevMode) => {
      if (mode && !prevMode) {
        state = { ...defaultState, ignore: true };
      } else if (!mode && prevMode) {
        state = defaultState;
      }
    });

    onChange('drawnGeometryAtom', (_current, prev) => {
      if (state.ignore) {
        state = { ...state, ignore: false };
        return;
      }
      state = {
        past: [...state.past, deepCopy(prev)],
        future: [],
        ignore: false,
      };
    });

    onAction('undo', () => {
      if (!state.past.length) return;
      const past = [...state.past];
      const previous = past.pop()!;
      const current = getUnlistedState(drawnGeometryAtom);
      state = {
        past,
        future: [deepCopy(current), ...state.future],
        ignore: true,
      };
      schedule((dispatch) => dispatch(drawnGeometryAtom.setFeatures(previous.features)));
    });

    onAction('redo', () => {
      if (!state.future.length) return;
      const [next, ...restFuture] = state.future;
      const current = getUnlistedState(drawnGeometryAtom);
      state = {
        past: [...state.past, deepCopy(current)],
        future: restFuture,
        ignore: true,
      };
      schedule((dispatch) => dispatch(drawnGeometryAtom.setFeatures(next.features)));
    });

    onAction('reset', () => {
      state = defaultState;
    });

    return state;
  },
  'drawHistoryAtom',
);

export type DrawHistoryAtom = typeof drawHistoryAtom;
