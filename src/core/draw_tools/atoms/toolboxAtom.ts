import { Action } from '@reatom/core';
import { sideControlsBarAtom } from '~core/shared_state';
import { createAtom } from '~utils/atoms';
import { DrawModeType, FOCUSED_GEOMETRY_EDITOR_CONTROL_ID } from '../constants';
import { activeDrawModeAtom } from './activeDrawMode';
import { drawnGeometryAtom } from './drawnGeometryAtom';
import { isDrawingStartedAtom } from './isDrawingStartedAtom';
import { selectedIndexesAtom } from './selectedIndexesAtom';
import { temporaryGeometryAtom } from './temporaryGeometryAtom';

type ToolboxState = {
  mode: DrawModeType | null;
  selectedIndexes: number[];
  drawingIsStarted?: boolean;
  avalibleModes?: DrawModeType[];
};

export const toolboxAtom = createAtom(
  {
    deleteFeatures: () => null,
    selectedIndexesAtom,
    activeDrawModeAtom,
    toggleDrawMode: (mode: DrawModeType) => mode,
    finishDrawing: () => null,
    isDrawingStartedAtom,
    setAvalibleModes: (modes: DrawModeType[]) => modes,
  },
  (
    { onAction, schedule, get },
    state: ToolboxState = { mode: null, selectedIndexes: [] },
  ) => {
    const actions: Action[] = [];
    let newState: ToolboxState = {
      ...state,
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
      actions.push(
        sideControlsBarAtom.disable(FOCUSED_GEOMETRY_EDITOR_CONTROL_ID),
      );
      actions.push(activeDrawModeAtom.setDrawMode(null));
    });

    // I think we don't need to specify the need for ModifyMode
    onAction('setAvalibleModes', (modes) => {
      newState = { ...newState, avalibleModes: modes };
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
