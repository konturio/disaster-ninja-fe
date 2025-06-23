import { i18n } from '~core/localization';
import { capitalize } from '~utils/common';

const language = i18n.instance.language || 'default';
const dateTimeFormatter = new Intl.DateTimeFormat(language, {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  timeZoneName: 'short',
}).format;

export const layerFeaturesFormats = {
  date_time(value?: string) {
    return value ? dateTimeFormatter(new Date(value)) : '';
  },
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
