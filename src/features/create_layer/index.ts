import { forceRun } from '~utils/atoms/forceRun';
import { layerSideBarButtonControllerAtom } from './atoms/layerSideBarButtonController';
import { editableLayersControlsAtom } from './atoms/editableLayersControls';
import { editableLayersLegendsAndSources } from './atoms/editableLayersLegendsAndSources';
import { openDrawToolsInFeatureEditMode } from './atoms/drawToolsController';
export { EditFeaturesOrLayerPanel } from './components/EditFeaturesOrLayerPanel/EditFeaturesOrLayerPanel';

export function initEditableLayer() {
  forceRun([
    // Temporary turned off for task #11733
    layerSideBarButtonControllerAtom,
    editableLayersControlsAtom, // Adds layers in layers panel
    editableLayersLegendsAndSources,
    openDrawToolsInFeatureEditMode,
  ]);
}
