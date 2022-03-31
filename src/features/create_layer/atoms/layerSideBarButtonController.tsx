import { createAtom } from '~utils/atoms';
import {
  CREATE_LAYER_CONTROL_ID,
  MAX_USER_LAYER_ALLOWED_TO_CREATE,
} from '~features/create_layer/constants';
import { TranslationService as i18n } from '~core/localization';
import {
  controlGroup,
  controlVisualGroup,
  sideControlsBarAtom,
} from '~core/shared_state/sideControlsBar';
import { AddLayerIcon } from '@k2-packages/default-icons';
import { createLayerControllerAtom } from './createLayerController';
import { editableLayersListResource } from './editableLayersListResource';

import { layersSettingsAtom } from '~core/logical_layers/atoms/layersSettings';

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
      createLayerControllerAtom.createNewLayer.dispatch();
    } else {
      createLayerControllerAtom.reset.dispatch();
    }
  },
};

/**
 * This atom add "create layer" control to side bar if creation allowed
 */
export const layerSideBarButtonControllerAtom = createAtom(
  {
    layersSettingsAtom,
    editableLayersListResource,
  },
  ({ getUnlistedState, schedule, onChange }) => {
    onChange('editableLayersListResource', (layersResource) => {
      const { data, loading, error } = layersResource;
      if (loading === true || error || data === null || data === undefined)
        return;
      // Editable layers laded, check count
      const userCanCreateMoreLayers =
        data.length < MAX_USER_LAYER_ALLOWED_TO_CREATE;
      const controlWasAddedBefore =
        !!getUnlistedState(sideControlsBarAtom)[sidebarButtonParams.id];
      // Add
      if (userCanCreateMoreLayers && !controlWasAddedBefore) {
        schedule((dispatch) => {
          dispatch(sideControlsBarAtom.addControl(sidebarButtonParams));
        });
        return;
      }
      // Or remove
      if (!userCanCreateMoreLayers && controlWasAddedBefore) {
        schedule((dispatch) => {
          dispatch(sideControlsBarAtom.removeControl(sidebarButtonParams.id));
        });
      }
      return;
    });
  },
  'createLayerSideBarButtonControllerAtom',
);
