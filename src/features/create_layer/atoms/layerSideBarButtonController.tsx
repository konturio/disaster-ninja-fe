import { AddLayer24 } from '@konturio/default-icons';
import { createAtom } from '~utils/atoms';
import { CREATE_LAYER_CONTROL_ID } from '~features/create_layer/constants';
import { i18n } from '~core/localization';
import {
  controlGroup,
  controlVisualGroup,
  toolbarControlsAtom,
} from '~core/shared_state/toolbarControls';
import { featureFlagsAtom, FeatureFlag } from '~core/shared_state';
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
    featureFlagsAtom,
  },
  ({ getUnlistedState, schedule, onChange }) => {
    onChange('featureFlagsAtom', (featureFlags) => {
      const currentControls = getUnlistedState(toolbarControlsAtom);
      // This flag already checked in Main.js, when user logout
      // FIXME: remove this button, if default user not contain that feature.
      // TODO: Add cleanup hooks for features

      if (featureFlags[FeatureFlag.CREATE_LAYER]) {
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
