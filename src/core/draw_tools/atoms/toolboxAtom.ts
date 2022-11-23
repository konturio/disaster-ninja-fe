import { downloadObject } from '~utils/file/download';
import core from '~core/index';
import { createAtom } from '~core/store/atoms';
import { FOCUSED_GEOMETRY_EDITOR_CONTROL_ID } from '../constants';
import { activeDrawModeAtom } from './activeDrawMode';
import { drawnGeometryAtom } from './drawnGeometryAtom';
import { isDrawingStartedAtom } from './isDrawingStartedAtom';
import { selectedIndexesAtom } from './selectedIndexesAtom';
import { temporaryGeometryAtom } from './temporaryGeometryAtom';
import type { DrawModeType } from '../constants';
import type { Action } from '@reatom/core';

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
    currentLocationAtom: core.router.atoms.currentLocationAtom,
  },
  (
    { onAction, schedule, get, getUnlistedState, onChange, create },
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
      actions.push(core.sharedState.toolbarControlsAtom.disable(FOCUSED_GEOMETRY_EDITOR_CONTROL_ID));
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
          core.sharedState.currentNotificationAtom.showNotification(
            'info',
            { title: core.i18n.t('draw_tools.no_geometry_error') },
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

    onChange('currentLocationAtom', () => {
      if (state.mode) actions.push(create('finishDrawing'));
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
