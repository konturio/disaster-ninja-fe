import { i18n } from '~core/localization';

const language = i18n.instance.language || 'default';
const dateTimeFormatter = new Intl.DateTimeFormat(language, {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  timeZoneName: 'short',
}).format;

function toTitleCase(word: string) {
  return word.charAt(0).toUpperCase() + word.substring(1).toLowerCase();
}

export const layerFeaturesFormats = {
  date_time(value?: string) {
    return value ? dateTimeFormatter(new Date(value)) : '';
  },
  join(values?: string[]) {
    return values?.join(', ') ?? '';
  },
  join_title(values?: string[]) {
    return values?.map(toTitleCase).join(', ') ?? '';
  },
  project_id(value?: string | number) {
    return value ? `#${value}` : '';
  },
  priority_level(value?: string) {
    return value
      ? i18n.t('layer_features_panel.priority', {
          level: toTitleCase(value),
        })
      : '';
  },
};
