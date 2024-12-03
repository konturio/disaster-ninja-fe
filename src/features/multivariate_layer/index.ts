import { i18n } from '~core/localization';
import { toolbar } from '~core/toolbar';
import { store } from '~core/store/store';
import { UPLOAD_MULTIVARIATE_CONTROL_ID } from './constants';
import { pickMultivariateFile } from './helpers/pickMultivariateFile';
import { createMultivariateLayer } from './helpers/multivariateLayerActions';
import type { MultivariateLayerConfig } from '~core/logical_layers/renderers/MultivariateRenderer/types';

const uploadClickListener = (e) => {
  pickMultivariateFile((multivariateConfig) => {
    if (multivariateConfig) {
      createMultivariateLayer(store.v3ctx, multivariateConfig as MultivariateLayerConfig);
    }
  });
};

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
  uploadMultivariateLayerControl.init();
}
