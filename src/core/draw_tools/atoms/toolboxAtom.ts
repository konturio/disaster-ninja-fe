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

interface DrawToolBoxSettings {
  availableModes?: DrawModeType[];
  finishButtonText?: string;
  finishButtonCallback?: () => Promise<boolean>;
}

type ToolboxState = {
  mode: DrawModeType | null;
  selectedIndexes: number[];
  drawingIsStarted?: boolean;
  settings: DrawToolBoxSettings;
};

export const toolboxAtom = createAtom(
  {
    deleteFeatures: () => null,
    selectedIndexesAtom,
    activeDrawModeAtom,
    toggleDrawMode: (mode: DrawModeType) => mode,
    finishDrawing: () => null,
    isDrawingStartedAtom,
    setSettings: (settings: DrawToolBoxSettings) => settings,
    downloadDrawGeometry: () => null,
  },
  (
    { onAction, schedule, get, getUnlistedState },
    state: ToolboxState = {
      mode: null,
      selectedIndexes: [],
      settings: {},
    },
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
    onAction('setSettings', (settings) => {
      newState = { ...newState, settings };
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
