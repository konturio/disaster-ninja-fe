import { Action } from '@reatom/core';
import { createAtom } from '~utils/atoms';
import { drawnGeometryAtom } from './drawnGeometryAtom';
import { Feature } from 'geojson';
import { temporaryGeometryAtom } from './temporaryGeometryAtom';
import { currentMapAtom, currentNotificationAtom } from '~core/shared_state';
import { NotificationType } from '~core/shared_state/currentNotifications';
import { NotificationMessage } from '~core/types/notification';
import { activeDrawModeAtom } from './activeDrawMode';
import { setMapInteractivity } from '~utils/map/setMapInteractivity';
import { drawModeLogicalLayerAtom } from './logicalLayerAtom';
import { selectedIndexesAtom } from './selectedIndexesAtom';
import { isDrawingStartedAtom } from './isDrawingStartedAtom';
import { drawModeRenderer } from './logicalLayerAtom';

export type DrawModeHooks =
  | 'drawnGeometryAtom'
  | 'temporaryGeometryAtom'
  | 'selectedIndexesAtom';
type CombinedAtomCallbacksType = {
  [key in DrawModeHooks]?: Array<(state) => void>;
};

/**
 * This atom combines other necessary atoms and their actions
 * needed for draw mode renderer
 */

export const combinedAtom = createAtom(
  {
    hookWithAtom: (description: [DrawModeHooks, (data) => typeof data]) =>
      description,
    activeDrawModeAtom,
    drawModeLogicalLayerAtom,
    currentMapAtom,

    drawnGeometryAtom,
    setFeatures: (features: Feature[]) => features,
    addFeature: (feature: Feature) => feature,

    temporaryGeometryAtom,
    updateTempFeatures: (features: Feature[], updateIndexes: number[]) => {
      return { features, indexes: updateIndexes };
    },

    selectedIndexesAtom,
    setIndexes: (indexes: number[]) => indexes,

    setDrawingIsStarted: (isStarted: boolean) => isStarted,

    showNotification: (
      type: NotificationType,
      message: NotificationMessage,
      lifetimeSec: number,
    ) => ({ type, message, lifetimeSec }),
  },
  (
    { onAction, schedule, onChange, get },
    state: CombinedAtomCallbacksType = {},
  ) => {
    const actions: Action[] = [];

    onChange('activeDrawModeAtom', (mode) => {
      const map = get('currentMapAtom');

      // turn on interactivity in case user switched mode without finishing drawing
      if (map) setMapInteractivity(map, true);

      if (!mode) {
        actions.push(drawModeLogicalLayerAtom.disable());
      } else {
        drawModeRenderer.setMode(mode);
      }
    });

    onAction('hookWithAtom', ([name, callback]) => {
      let hooks = state[name];
      if (hooks) hooks.push(callback);
      else hooks = [callback];
      state = { ...state, [name]: hooks };
    });

    onAction('setFeatures', (features) =>
      actions.push(drawnGeometryAtom.setFeatures(features)),
    );

    onAction('addFeature', (feature) =>
      actions.push(drawnGeometryAtom.addFeature(feature)),
    );

    onAction('updateTempFeatures', ({ features, indexes }) => {
      actions.push(temporaryGeometryAtom.setFeatures(features, indexes));
    });

    onChange('drawnGeometryAtom', (featureCollection) =>
      (state.drawnGeometryAtom ?? []).forEach((cb) => cb(featureCollection)),
    );

    onChange('temporaryGeometryAtom', (featureCollection) => {
      (state.temporaryGeometryAtom ?? []).forEach((cb) =>
        cb(featureCollection),
      );
    });

    onAction('setIndexes', (indexes) => {
      actions.push(selectedIndexesAtom.setIndexes(indexes));
    });

    onChange('selectedIndexesAtom', (indexes) => {
      (state.selectedIndexesAtom ?? []).forEach((cb) => cb(indexes));
    });

    onAction('setDrawingIsStarted', (isStarted) =>
      actions.push(isDrawingStartedAtom.setIsStarted(isStarted)),
    );

    onAction('showNotification', ({ type, message, lifetimeSec }) => {
      actions.push(
        currentNotificationAtom.showNotification(type, message, lifetimeSec),
      );
    });

    actions.length &&
      schedule((dispatch) => {
        dispatch(actions);
      });

    return state;
  },

  'combinedAtom',
);

export type CombinedAtom = typeof combinedAtom;
