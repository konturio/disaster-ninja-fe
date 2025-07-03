import { i18n } from '~core/localization';
import { capitalize } from '~utils/common';

export const layerFeaturesFormats = {
  project_id(value?: string | number) {
    return value ? `#${value}` : '';
  },
  priority_level(value?: string) {
    return value
      ? i18n.t('layer_features_panel.priority', {
          level: capitalize(value),
        })
      : '';
  },
};
