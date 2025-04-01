import { i18n } from '~core/localization';
import { toolbar } from '~core/toolbar';
import { store } from '~core/store/store';
import {
  CREATE_MULTIVARIATE_CONTROL_ID,
  UPLOAD_MULTIVARIATE_CONTROL_ID,
} from './constants';
import { pickMultivariateFile } from './helpers/pickMultivariateFile';
import { createMultivariateLayer } from './helpers/multivariateLayerActions';
import { createMultivariateConfig } from './helpers/createMultivariateConfig';
import type { MultivariateLayerStyle } from '~core/logical_layers/renderers/stylesConfigs/multivariate/multivariateStyle';

const uploadClickListener = () => {
  pickMultivariateFile((multivariateConfig) => {
    if (multivariateConfig) {
      createMultivariateLayer(store.v3ctx, multivariateConfig as MultivariateLayerStyle);
    }
  });
};

export const createMultivariateLayerControl = toolbar.setupControl({
  id: CREATE_MULTIVARIATE_CONTROL_ID,
  type: 'button',
  typeSettings: {
    name: i18n.t('multivariate.create_analysis_layer'),
    hint: i18n.t('multivariate.create_analysis_layer'),
    icon: 'Layers24',
    preferredSize: 'large',
  },
});

createMultivariateLayerControl.onStateChange(async (ctx, state) => {
  if (state === 'active') {
    const result = await createMultivariateConfig();
    //const mcdaConfig = await createMCDAConfig();
    if (result) {
      store.dispatch([
        //mcdaLayerAtom.createMCDALayer(mcdaConfig),
        createMultivariateLayerControl.setState('regular'),
      ]);
    } else {
      store.dispatch(createMultivariateLayerControl.setState('regular'));
    }
  }
});

export const uploadMultivariateLayerControl = toolbar.setupControl({
  id: UPLOAD_MULTIVARIATE_CONTROL_ID,
  type: 'button',
  typeSettings: {
    name: i18n.t('multivariate.upload_analysis_layer'),
    hint: i18n.t('multivariate.upload_analysis_layer'),
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

uploadMultivariateLayerControl.onStateChange((ctx, state) => {
  if (state === 'active') {
    store.dispatch(uploadMultivariateLayerControl.setState('regular'));
  }
});

export function initMultivariateControl() {
  createMultivariateLayerControl.init();
  uploadMultivariateLayerControl.init();
}
