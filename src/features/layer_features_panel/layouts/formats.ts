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
};
