import { createAtom } from '~utils/atoms';
import { CREATE_LAYER_CONTROL_ID, MAX_USER_LAYER_ALLOWED_TO_CREATE } from '~features/create_layer/constants';
import { TranslationService as i18n } from '~core/localization';
import { controlGroup, controlVisualGroup, sideControlsBarAtom } from '~core/shared_state/sideControlsBar';
import { AddLayerIcon } from '@k2-packages/default-icons';
import { createLayerControllerAtom } from '~features/create_layer/atoms/createLayerController';
import { layersSettingsAtom } from '~core/logical_layers/atoms/layersSettings';
import { layersUserDataAtom } from '~core/logical_layers/atoms/layersUserData';
import { mountedLayersAtom } from '~core/logical_layers/atoms/mountedLayers';
import { UpdateCallbackLayersLoading, updateCallbackService } from '~core/update_callbacks';
import { userResourceAtom } from '~core/auth';
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
  onChange: (becomesActive) => {
    if (becomesActive) {
      createLayerControllerAtom.createNewLayer.dispatch();
    } else {
      createLayerControllerAtom.reset.dispatch();
    }
  },
}

export const createLayerSideBarButtonControllerAtom = createAtom({
    layersSettingsAtom,
    layersUserDataAtom,
    layersLoadedCallback: updateCallbackService.addCallback(UpdateCallbackLayersLoading),
  },
  ({ get, getUnlistedState, schedule }) => {
    const isLayersLoading = get('layersLoadedCallback');
    const sidebarState = getUnlistedState(sideControlsBarAtom)
    const { data: userModel } = getUnlistedState(userResourceAtom);
    if (!isLayersLoading.params?.loaded || !userModel?.hasFeature(AppFeature.CREATE_LAYER)) {
      if (sidebarState[CREATE_LAYER_CONTROL_ID]) {
        schedule((dispatch) => {
          dispatch(sideControlsBarAtom.removeControl(CREATE_LAYER_CONTROL_ID));
        });
      }
      return;
    }
    const settingsRegistryKeys = Array.from(getUnlistedState(layersSettingsAtom))
      .filter(([, val]) => val?.data?.ownedByUser).map(([key]) => key);
    const userDataRegistryKeys = Array.from(getUnlistedState(layersUserDataAtom).keys());
    const intersect = settingsRegistryKeys.filter((settingsKey) => userDataRegistryKeys.includes(settingsKey));
    if (sidebarState[CREATE_LAYER_CONTROL_ID]) {
      if (intersect.length >= MAX_USER_LAYER_ALLOWED_TO_CREATE) {
        schedule((dispatch) => {
          dispatch(sideControlsBarAtom.removeControl(CREATE_LAYER_CONTROL_ID));
        });
      }
    } else {
      if (intersect.length < MAX_USER_LAYER_ALLOWED_TO_CREATE) {
        schedule((dispatch) => {
          dispatch(sideControlsBarAtom.addControl(sidebarButtonParams));
        });
      }
    }
  },
  "createLayerSideBarButtonControllerAtom"
);
