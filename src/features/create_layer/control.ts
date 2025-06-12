import { toolbar } from '~core/toolbar';
import { i18n } from '~core/localization';
import { forceRun } from '~utils/atoms/forceRun';
import { openDrawToolsInFeatureEditMode } from '~features/create_layer/atoms/drawToolsController';
import { editableLayersLegendsAndSources } from '~features/create_layer/atoms/editableLayersLegendsAndSources';
import { editableLayersControlsAtom } from '~features/create_layer/atoms/editableLayersControls';
import { editableLayerControllerAtom } from '~features/create_layer/atoms/editableLayerController';
import { CREATE_LAYER_CONTROL_ID, CREATE_LAYER_CONTROL_NAME } from './constants';

export const createLayerController = toolbar.setupControl({
  id: CREATE_LAYER_CONTROL_ID,
  borrowMapInteractions: false,
  type: 'button',
  typeSettings: {
    name: CREATE_LAYER_CONTROL_NAME,
    hint: i18n.t('create_layer.create_layer'),
    icon: 'AddLayer24',
    preferredSize: 'large',
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

createLayerController.onInit(() =>
  forceRun([
    openDrawToolsInFeatureEditMode,
    editableLayersLegendsAndSources,
    editableLayersControlsAtom,
  ]),
);
