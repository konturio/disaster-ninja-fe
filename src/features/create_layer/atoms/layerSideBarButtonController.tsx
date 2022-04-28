import { createAtom } from '~utils/atoms';
import { CREATE_LAYER_CONTROL_ID } from '~features/create_layer/constants';
import { TranslationService as i18n } from '~core/localization';
import {
  controlGroup,
  controlVisualGroup,
  sideControlsBarAtom,
} from '~core/shared_state/sideControlsBar';
import { AddLayerIcon } from '@k2-packages/default-icons';
import { editableLayerControllerAtom } from './editableLayerController';
import { userResourceAtom } from '~core/auth/atoms/userResource';
import { AppFeature } from '~core/auth/types';

const sidebarButtonParams = {
  id: CREATE_LAYER_CONTROL_ID,
  name: CREATE_LAYER_CONTROL_ID,
  title: i18n.t('Create layer'),
  active: false,
  exclusiveGroup: controlGroup.mapTools,
  visualGroup: controlVisualGroup.noAnalytics,
  icon: <AddLayerIcon />,
  onClick: () => {
    sideControlsBarAtom.toggleActiveState.dispatch(CREATE_LAYER_CONTROL_ID);
  },
  onChange: (becomesActive: boolean) => {
    if (becomesActive) {
      editableLayerControllerAtom.createNewLayer.dispatch();
    } else {
      editableLayerControllerAtom.reset.dispatch();
    }
  },
};

/**
 * This atom add "create layer" control to side bar if creation allowed
 */
export const layerSideBarButtonControllerAtom = createAtom(
  {
    userResourceAtom,
  },
  ({ getUnlistedState, schedule, onChange }) => {
    onChange('userResourceAtom', (userResource) => {
      const { data: userModel, loading, error } = userResource;
      if (
        loading === true ||
        error ||
        userModel === null ||
        userModel === undefined
      )
        return;

      const currentControls = getUnlistedState(sideControlsBarAtom);
      // This flag already checked in Main.js, when user logout
      // I need to remove this button, if default user not contain that feature.
      // TODO: Add cleanup hooks for features

      if (userModel.hasFeature(AppFeature.CREATE_LAYER)) {
        // But not added
        if (!currentControls[sidebarButtonParams.id]) {
          schedule((dispatch) => {
            dispatch(sideControlsBarAtom.addControl(sidebarButtonParams));
          });
        }
      } else {
        // Disabled
        // But not removed
        if (currentControls[sidebarButtonParams.id]) {
          schedule((dispatch) => {
            dispatch(sideControlsBarAtom.removeControl(sidebarButtonParams.id));
          });
        }
      }
    });
  },
  'createLayerSideBarButtonControllerAtom',
);
