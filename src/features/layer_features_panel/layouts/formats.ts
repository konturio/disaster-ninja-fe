import { i18n } from '~core/localization';

function getDateTimeFormatter() {
  const language = i18n.instance.language || 'default';
  return new Intl.DateTimeFormat(language, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZoneName: 'short',
  });
}

function getMonthYearFormatter() {
  const language = i18n.instance.language || 'default';
  return new Intl.DateTimeFormat(language, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function toTitleCase(word: string) {
  return word.charAt(0).toUpperCase() + word.substring(1).toLowerCase();
}

export const layerFeaturesFormats = {
  date_time(value?: string) {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return getDateTimeFormatter().format(date);
  },
  date_month_year(value?: string) {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return getMonthYearFormatter().format(date);
  },
  join(values?: string[]) {
    return values?.join(', ') ?? '';
  },
  join_title(values?: string[]) {
    return values?.map(toTitleCase).join(', ') ?? '';
  },
};
