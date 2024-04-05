import { i18n } from '~core/localization';
import { toolbar } from '~core/toolbar';
import { store } from '~core/store/store';
import { enabledLayersAtom } from '~core/logical_layers/atoms/enabledLayers';
import { getMutualExcludedActions } from '~core/logical_layers/utils/getMutualExcludedActions';
import { mcdaLayerAtom } from './atoms/mcdaLayer';
import { createMCDAConfig, editMCDAConfig } from './mcdaConfig';
import { MCDA_CONTROL_ID, UPLOAD_MCDA_CONTROL_ID } from './constants';
import { askMcdaJSONFile } from './openMcdaFile';
import type {
  LogicalLayerActions,
  LogicalLayerState,
} from '~core/logical_layers/types/logicalLayer';

export const mcdaControl = toolbar.setupControl({
  id: MCDA_CONTROL_ID,
  type: 'button',
  typeSettings: {
    name: i18n.t('mcda.name'),
    hint: i18n.t('mcda.title'),
    icon: 'Layers24',
    preferredSize: 'large',
  },
});

mcdaControl.onStateChange(async (ctx, state) => {
  if (state === 'active') {
    const mcdaConfig = await createMCDAConfig();
    if (mcdaConfig) {
      store.dispatch([
        mcdaLayerAtom.createMCDALayer(mcdaConfig),
        mcdaControl.setState('regular'),
      ]);
    } else {
      store.dispatch(mcdaControl.setState('regular'));
    }
  }
});

const uploadClickListener = (e) => {
  uploadOnClick();
};

export const uploadMcdaControl = toolbar.setupControl({
  id: UPLOAD_MCDA_CONTROL_ID,
  type: 'button',
  typeSettings: {
    name: i18n.t('toolbar.upload_mcda'),
    hint: '',
    icon: 'UploadAnalysis16',
    preferredSize: 'large',
    onRef: (el) => {
      /**
       * In webkit you can't use additional function wrapper including useCallback
       * because it's disable file upload popup.
       */
      el?.addEventListener('click', uploadClickListener);
    },
  },
});

function uploadOnClick() {
  askMcdaJSONFile((mcdaConfig) => {
    if (mcdaConfig) {
      store.dispatch([mcdaLayerAtom.createMCDALayer(mcdaConfig)]);
    }
  });
}

uploadMcdaControl.onStateChange((ctx, state) => {
  if (state === 'active') {
    store.dispatch(uploadMcdaControl.setState('regular'));
  }
});

/** Edit MCDA */
export async function editMCDA(
  layerState: LogicalLayerState,
  layerActions: LogicalLayerActions,
) {
  const config = await editMCDAConfig(layerState);
  if (config?.id) {
    layerActions.destroy();
    store.dispatch([
      mcdaLayerAtom.createMCDALayer({ ...config, id: config.id }),
      enabledLayersAtom.set(config.id),
      ...getMutualExcludedActions(layerState),
    ]);
  }
}

export function initMCDA() {
  mcdaControl.init();
  uploadMcdaControl.init();
}
