import { forceRun } from '~utils/atoms/forceRun';
import { AppFeature } from '~core/auth/types';
import { layerSideBarButtonControllerAtom } from './atoms/layerSideBarButtonController';
import { editableLayersControlsAtom } from './atoms/editableLayersControls';
import { editableLayersLegendsAndSources } from './atoms/editableLayersLegendsAndSources';
import { openDrawToolsInFeatureEditMode } from './atoms/drawToolsController';
import { EditFeaturesOrLayerPanel } from './components/EditFeaturesOrLayerPanel/EditFeaturesOrLayerPanel';
import type { FeatureInterface } from '~utils/metrics/lazyFeatureLoad';

function initEditableLayer(reportReady) {
  forceRun([
    layerSideBarButtonControllerAtom,
    editableLayersControlsAtom, // Adds layers in layers panel
    editableLayersLegendsAndSources,
    openDrawToolsInFeatureEditMode,
  ]);
  reportReady();
}

// todo improve that logic on #11232
/* eslint-disable react/display-name */
export const featureInterface: FeatureInterface = {
  affectsMap: true,
  id: AppFeature.CREATE_LAYER,
  rootComponentWrap(reportReady, addedProps) {
    return () => <EditFeaturesOrLayerPanel reportReady={reportReady} />;
  },
  initFunction(reportReady, ...args) {
    initEditableLayer(reportReady);
  },
};
