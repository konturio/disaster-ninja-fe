import { downloadObject } from '~utils/file/download';
import { i18n } from '~core/localization';
import { createAtom } from '~utils/atoms';
import { currentNotificationAtom } from '~core/shared_state';
import { currentLocationAtom } from '~core/router/atoms/currentLocation';
import { activeDrawModeAtom } from './activeDrawMode';
import { drawnGeometryAtom } from './drawnGeometryAtom';
import { isDrawingStartedAtom } from './isDrawingStartedAtom';
import { selectedIndexesAtom } from './selectedIndexesAtom';
import { temporaryGeometryAtom } from './temporaryGeometryAtom';
import type { DrawModeType } from '../constants';
import type { Action } from '@reatom/core-v2';

interface DrawToolBoxSettings {
  availableModes?: DrawModeType[];
  finishButtonText?: string;
  finishButtonCallback?: () => void;
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
    cancelDrawing: () => null, // New action
    isDrawingStartedAtom,
    setSettings: (settings: DrawToolBoxSettings) => settings,
    downloadDrawGeometry: () => null,
    currentLocationAtom,
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
      actions.push(activeDrawModeAtom.setDrawMode(null));
      // call to finish drawing callback
      newState.settings?.finishButtonCallback?.();
    });

    onAction('cancelDrawing', () => {
      actions.push(activeDrawModeAtom.setDrawMode(null));
      actions.push(drawnGeometryAtom.resetToDefault());
      actions.push(temporaryGeometryAtom.resetToDefault());
    });

    onAction('setSettings', (settings) => {
      newState = { ...newState, settings };
    });

    onAction('downloadDrawGeometry', () => {
      const data = getUnlistedState(drawnGeometryAtom);

      if (!data.features.length)
        return actions.push(
          currentNotificationAtom.showNotification(
            'info',
            { title: i18n.t('draw_tools.no_geometry_error') },
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
