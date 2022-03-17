import { sideControlsBarAtom } from '~core/shared_state';
import { TranslationService as i18n } from '~core/localization';
import {
  controlGroup,
  controlVisualGroup,
} from '~core/shared_state/sideControlsBar';
import { AddLayerIcon } from '@k2-packages/default-icons';
import { CREATE_LAYER_CONTROL_ID } from '~features/create_layer/constants';
import { createLayerControllerAtom } from '~features/create_layer/atoms/createLayerController';

export function initCreateLayer() {
  sideControlsBarAtom.addControl.dispatch({
    id: CREATE_LAYER_CONTROL_ID,
    name: CREATE_LAYER_CONTROL_ID,
    title: i18n.t('Create layer'),
    active: false,
    exclusiveGroup: controlGroup.mapTools,
    visualGroup: controlVisualGroup.noAnalitics,
    icon: <AddLayerIcon />,
    onClick: () => {
      sideControlsBarAtom.toggleActiveState.dispatch(CREATE_LAYER_CONTROL_ID);
    },
    onChange: (becomesActive) => {
      if (becomesActive) {
        createLayerControllerAtom.createNewLayer.dispatch();
      } else {
        createLayerControllerAtom.reset.dispatch();
      }
    },
  });
}
