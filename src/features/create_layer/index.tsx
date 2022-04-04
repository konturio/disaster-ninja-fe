import { forceRun } from '~utils/atoms/forceRun';
import { layerSideBarButtonControllerAtom } from './atoms/layerSideBarButtonController';
import { editableLayersControlsAtom } from './atoms/editableLayersControls';
import { editableLayersLegendsAndSources } from './atoms/editableLayersLegendsAndSources';

export function initEditableLayer() {
  forceRun([
    layerSideBarButtonControllerAtom,
    editableLayersControlsAtom,
    editableLayersLegendsAndSources,
  ]);
}
