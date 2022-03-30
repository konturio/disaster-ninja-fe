import { Action } from '@reatom/core';
import { sideControlsBarAtom } from '~core/shared_state';
import { createAtom } from '~utils/atoms';
import { DrawModeType, FOCUSED_GEOMETRY_EDITOR_CONTROL_ID } from '../constants';
import { activeDrawModeAtom } from './activeDrawMode';
import { drawnGeometryAtom } from './drawnGeometryAtom';
import { isDrawingStartedAtom } from './isDrawingStartedAtom';
import { selectedIndexesAtom } from './selectedIndexesAtom';
import { temporaryGeometryAtom } from './temporaryGeometryAtom';
import { currentNotificationAtom } from '~core/shared_state';
import { TranslationService as i18n } from '~core/localization';
import { downloadObject } from '~utils/fileHelpers/download';

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
    downloadDrawGeometry: () => null,
  },
  (
    { onAction, schedule, get, getUnlistedState },
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
      actions.push(
        sideControlsBarAtom.disable(FOCUSED_GEOMETRY_EDITOR_CONTROL_ID),
      );
      actions.push(activeDrawModeAtom.setDrawMode(null));
    });

    onAction('downloadDrawGeometry', () => {
      const data = getUnlistedState(drawnGeometryAtom);

      if (!data.features.length)
        return actions.push(
          currentNotificationAtom.showNotification(
            'info',
            { title: i18n.t('No drawn geometry to download') },
            5,
          ),
        );
      // clear features from service properties
      const cleared = {
        type: 'FeatureCollection',
        features: data.features.map((feature) => {
          return { ...feature, properties: {} };
        }),
      };
      downloadObject(
        cleared,
        `Disaster_Ninja_custom_geometry_${new Date().toISOString()}.json`,
      );
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
