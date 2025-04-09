import { i18n } from '~core/localization';
import { toolbar } from '~core/toolbar';
import { store } from '~core/store/store';
import { applyNewLayerStyle } from '../../core/logical_layers/utils/applyNewLayerStyle';
import {
  CREATE_MULTIVARIATE_CONTROL_ID,
  UPLOAD_MULTIVARIATE_CONTROL_ID,
} from './constants';
import { pickMultivariateFile } from './helpers/pickMultivariateFile';
import { createMultivariateLayer } from './helpers/multivariateLayerActions';
import { openMultivariateModal } from './helpers/openMultivariateModal';
import type { LogicalLayerActions } from '~core/logical_layers/types/logicalLayer';
import type { MultivariateLayerStyle } from '~core/logical_layers/renderers/stylesConfigs/multivariate/multivariateStyle';
import type { MultivariateLayerConfig } from '~core/logical_layers/renderers/MultivariateRenderer/types';

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
    const result = await openMultivariateModal();
    if (result?.config) {
      store.dispatch([createMultivariateLayerControl.setState('regular')]);
      createMultivariateLayer(store.v3ctx, {
        type: 'multivariate',
        config: result.config,
      });
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

export async function editMultivariateLayer(
  oldConfig: MultivariateLayerConfig,
  layerActions: LogicalLayerActions,
) {
  const result = await openMultivariateModal(oldConfig);
  const config = result?.config;
  if (config?.id) {
    const style: MultivariateLayerStyle = {
      type: 'multivariate',
      config,
    };
    if (config.id === oldConfig.id) {
      // update existing MVA
      applyNewLayerStyle(style);
    } else {
      // recreate MVA with a new id
      layerActions.destroy();
      createMultivariateLayer(store.v3ctx, style);
    }
  }
}
