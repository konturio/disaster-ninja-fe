import { Action } from '@reatom/core';
import { sideControlsBarAtom } from '~core/shared_state';
import { createAtom } from '~utils/atoms';
import { DrawModeType, DRAW_TOOLS_CONTROL_ID } from '../constants';
import { activeDrawModeAtom } from './activeDrawMode';
import { drawnGeometryAtom } from './drawnGeometryAtom';
import { isDrawingStartedAtom } from './isDrawingStartedAtom';
import { selectedIndexesAtom } from './selectedIndexesAtom';
import { temporaryGeometryAtom } from './temporaryGeometryAtom';

type ToolboxState = {
  mode: DrawModeType | null;
  selectedIndexes: number[];
  drawingIsStarted?: boolean;
};

export const toolboxAtom = createAtom(
  {
    deleteFeatures: () => null,
    selectedIndexesAtom,
    activeDrawModeAtom,
    toggleDrawMode: (mode: DrawModeType) => mode,
    finishDrawing: () => null,
    isDrawingStartedAtom,
  },
  (
    { onAction, schedule, get },
    state: ToolboxState = { mode: null, selectedIndexes: [] },
  ) => {
    const actions: Action[] = [];
    const newState: ToolboxState = {
      mode: get('activeDrawModeAtom'),
      selectedIndexes: get('selectedIndexesAtom'),
      drawingIsStarted: get('isDrawingStartedAtom'),
    };

    onAction('deleteFeatures', () => {
      if (!newState.selectedIndexes.length) return;
      schedule((dispatch) => dispatch(selectedIndexesAtom.setIndexes([])));
      actions.push(drawnGeometryAtom.removeByIndexes(newState.selectedIndexes));
      actions.push(temporaryGeometryAtom.resetToDefault());
    });

    onAction('toggleDrawMode', (mode) => {
      actions.push(activeDrawModeAtom.toggleDrawMode(mode));
    });

    onAction('finishDrawing', () => {
      actions.push(sideControlsBarAtom.disable(DRAW_TOOLS_CONTROL_ID));
      actions.push(activeDrawModeAtom.setDrawMode(null));
    });

    actions.length &&
      schedule((dispatch) => {
        dispatch(actions);
      });

    state = newState;
    return state;
  },
  'toolboxAtom',
);
