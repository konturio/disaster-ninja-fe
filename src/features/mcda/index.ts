import { i18n } from '~core/localization';
import { toolbar } from '~core/toolbar';
import { store } from '~core/store/store';
import { dispatchMetricsEvent } from '~core/metrics/dispatch';
import { mcdaLayerAtom } from './atoms/mcdaLayer';
import { createMCDAConfig, editMCDAConfig } from './mcdaConfig';
import { MCDA_CONTROL_ID, UPLOAD_MCDA_CONTROL_ID } from './constants';
import { askMcdaJSONFile } from './utils/openMcdaFile';
import { applyNewMCDAConfig } from './utils/applyNewMCDAConfig';
import type { MCDAConfig } from '~core/logical_layers/renderers/stylesConfigs/mcda/types';
import type { LogicalLayerActions } from '~core/logical_layers/types/logicalLayer';

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
    dispatchMetricsEvent('mcda_start');
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

const uploadClickListener = () => {
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
export async function editMCDA(oldConfig: MCDAConfig, layerActions: LogicalLayerActions) {
  const config = await editMCDAConfig(oldConfig);
  if (config?.id) {
    if (config.id === oldConfig.id) {
      // update existing MCDA
      applyNewMCDAConfig(config);
    } else {
      // recreate MCDA with a new id
      layerActions.destroy();
      store.dispatch([mcdaLayerAtom.createMCDALayer({ ...config, id: config.id })]);
    }
  }
}

export function initMCDA() {
  mcdaControl.init();
  uploadMcdaControl.init();
}
