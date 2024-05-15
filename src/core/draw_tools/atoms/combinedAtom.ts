import { createAtom } from '~utils/atoms';
import { currentMapAtom, currentNotificationAtom } from '~core/shared_state';
import { setMapInteractivity } from '~utils/map/setMapInteractivity';
import { activeDrawModeAtom } from './activeDrawMode';
import { temporaryGeometryAtom } from './temporaryGeometryAtom';
import { drawnGeometryAtom } from './drawnGeometryAtom';
import { drawModeLogicalLayerAtom } from './logicalLayerAtom';
import {
  selectedIndexesAtom,
  setIndexesForCurrentGeometryAtom,
} from './selectedIndexesAtom';
import { isDrawingStartedAtom } from './isDrawingStartedAtom';
import { drawModeRenderer } from './logicalLayerAtom';
import type { NotificationMessage } from '~core/types/notification';
import type { NotificationType } from '~core/shared_state/currentNotifications';
import type { Feature } from 'geojson';
import type { Action } from '@reatom/core-v2';

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
    hookWithAtom: (description: [DrawModeHooks, (data) => typeof data]) => description,
    activeDrawModeAtom,
    drawModeLogicalLayerAtom,
    currentMapAtom,

    drawnGeometryAtom,
    setFeatures: (features: Feature[]) => features,
    addFeature: (feature: Feature) => feature,

    temporaryGeometryAtom,
    updateTempFeatures: (d: { features: Feature[]; indexes: number[] }) => d,

    selectedIndexesAtom,
    setIndexes: (indexes: number[]) => indexes,
    setIndexesForCurrentGeometryAtom,

    setDrawingIsStarted: (isStarted: boolean) => isStarted,

    showNotification: (d: {
      type: NotificationType;
      message: NotificationMessage;
      lifetimeSec: number;
    }) => d,
  },
  (
    { onAction, schedule, onChange, get, getUnlistedState },
    state: CombinedAtomCallbacksType = {},
  ) => {
    const actions: Action[] = [];
    const selectCurrentGeometryWasRequested = get('setIndexesForCurrentGeometryAtom');

    onChange('activeDrawModeAtom', (mode) => {
      const map = get('currentMapAtom');

      // turn on interactivity in case user switched mode without finishing drawing
      if (map) setMapInteractivity(map, true);

      if (!mode) {
        const layer = getUnlistedState(drawModeLogicalLayerAtom);
        if (layer.isEnabled) {
          actions.push(drawModeLogicalLayerAtom.disable());
        }
      } else {
        drawModeRenderer.addClickListener();
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

    onAction('addFeature', (feature) => {
      actions.push(activeDrawModeAtom.setDrawMode('ModifyMode'));
      actions.push(drawnGeometryAtom.addFeature(feature));
    });

    onAction('updateTempFeatures', ({ features, indexes }) => {
      actions.push(temporaryGeometryAtom.setFeatures({ features, indexes }));
    });

    onChange('drawnGeometryAtom', (featureCollection, prevCollection) => {
      if (selectCurrentGeometryWasRequested) {
        // add indexes to select and disable request for setting indexes
        actions.push(setIndexesForCurrentGeometryAtom.set(false));
        const indexes: number[] = [];
        featureCollection.features.map((_, index) => indexes.push(index));
        actions.push(selectedIndexesAtom.setIndexes(indexes));
      }
      (state.drawnGeometryAtom ?? []).forEach((cb) => cb(featureCollection));
    });

    onChange('temporaryGeometryAtom', (featureCollection) => {
      (state.temporaryGeometryAtom ?? []).forEach((cb) => cb(featureCollection));
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
      actions.push(currentNotificationAtom.showNotification(type, message, lifetimeSec));
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
