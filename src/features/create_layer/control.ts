import { toolbar } from '~core/toolbar';
import { i18n } from '~core/localization';
import { CREATE_LAYER_CONTROL_ID, CREATE_LAYER_CONTROL_NAME } from './constants';

export const createLayerController = toolbar.setupControl({
  id: CREATE_LAYER_CONTROL_ID,
  borrowMapInteractions: false,
  type: 'button',
  typeSettings: {
    name: CREATE_LAYER_CONTROL_NAME,
    hint: i18n.t('create_layer.create_layer'),
    icon: 'AddLayer24',
    preferredSize: 'large',
  },
});
