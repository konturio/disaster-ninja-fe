import { AddLayer24 } from '@konturio/default-icons';
import { createAtom } from '~core/store/atoms';
import { CREATE_LAYER_CONTROL_ID } from '~features/create_layer/constants';
import core from '~core/index';
import {
  controlGroup,
  controlVisualGroup,
  toolbarControlsAtom,
} from '~core/shared_state/toolbarControls';
import { AppFeature } from '~core/app_features';
import { editableLayerControllerAtom } from './editableLayerController';

const sidebarButtonParams = {
  id: CREATE_LAYER_CONTROL_ID,
  name: CREATE_LAYER_CONTROL_ID,
  title: core.i18n.t('create_layer.create_layer'),
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
    features: core.features.atom,
  },
  ({ getUnlistedState, schedule, onChange }) => {
    onChange('features', (features) => {
      const currentControls = getUnlistedState(toolbarControlsAtom);
      // This flag already checked in Main.js, when user logout
      // I need to remove this button, if default user not contain that feature.
      // TODO: Add cleanup hooks for features

      if (features.has(AppFeature.CREATE_LAYER)) {
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
