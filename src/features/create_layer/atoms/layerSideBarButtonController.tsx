import { AddLayer24 } from '@konturio/default-icons';
import { createAtom } from '~utils/atoms';
import { CREATE_LAYER_CONTROL_ID } from '~features/create_layer/constants';
import { i18n } from '~core/localization';
import {
  controlGroup,
  controlVisualGroup,
  toolbarControlsAtom,
} from '~core/shared_state/toolbarControls';
import { userResourceAtom } from '~core/auth/atoms/userResource';
import { AppFeature } from '~core/auth/types';
import { editableLayerControllerAtom } from './editableLayerController';

const sidebarButtonParams = {
  id: CREATE_LAYER_CONTROL_ID,
  name: CREATE_LAYER_CONTROL_ID,
  title: i18n.t('create_layer.create_layer'),
  active: false,
  exclusiveGroup: controlGroup.mapTools,
  visualGroup: controlVisualGroup.noAnalytics,
  icon: <AddLayer24 />,
  onClick: () => {
    toolbarControlsAtom.toggleActiveState.dispatch(CREATE_LAYER_CONTROL_ID);
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

      const currentControls = getUnlistedState(toolbarControlsAtom);
      // This flag already checked in Main.js, when user logout
      // I need to remove this button, if default user not contain that feature.
      // TODO: Add cleanup hooks for features

      if (userModel.hasFeature(AppFeature.CREATE_LAYER)) {
        // But not added
        if (!currentControls[sidebarButtonParams.id]) {
          schedule((dispatch) => {
            dispatch(toolbarControlsAtom.addControl(sidebarButtonParams));
          });
        }
      } else {
        // Disabled
        // But not removed
        if (currentControls[sidebarButtonParams.id]) {
          schedule((dispatch) => {
            dispatch(toolbarControlsAtom.removeControl(sidebarButtonParams.id));
          });
        }
      }
    });
  },
  'createLayerSideBarButtonControllerAtom',
);
