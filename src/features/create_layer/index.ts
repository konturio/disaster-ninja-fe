import { forceRun } from '~utils/atoms/forceRun';
import { toolbar } from '~core/toolbar';
import { i18n } from '~core/localization';
import { editableLayersControlsAtom } from './atoms/editableLayersControls';
import { editableLayersLegendsAndSources } from './atoms/editableLayersLegendsAndSources';
import { openDrawToolsInFeatureEditMode } from './atoms/drawToolsController';
import { CREATE_LAYER_CONTROL_ID } from './constants';
import { editableLayerControllerAtom } from './atoms/editableLayerController';
export { EditFeaturesOrLayerPanel } from './components/EditFeaturesOrLayerPanel/EditFeaturesOrLayerPanel';

export const createLayerController = toolbar.setupControl({
  id: CREATE_LAYER_CONTROL_ID,
  type: 'button',
  typeSettings: {
    name: CREATE_LAYER_CONTROL_ID,
    hint: i18n.t('create_layer.create_layer'),
    icon: 'AddLayer24',
    preferredSize: 'small',
  },
});

createLayerController.onStateChange((ctx, state) => {
  if (state === 'active') {
    editableLayerControllerAtom.createNewLayer.dispatch();
  } else {
    editableLayerControllerAtom.reset.dispatch();
  }
});

createLayerController.onRemove(() => {
  editableLayerControllerAtom.reset.dispatch();
});

export function initEditableLayer() {
  forceRun([
    editableLayersControlsAtom, // Adds layers in layers panel
    editableLayersLegendsAndSources,
    openDrawToolsInFeatureEditMode,
  ]);
}
