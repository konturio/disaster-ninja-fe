import { i18n } from '~core/localization';

const language = i18n.instance.language || 'default';

export const dateFormatter = new Intl.DateTimeFormat(language, {
  hour: 'numeric',
  minute: 'numeric',
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  timeZoneName: 'short',
}).format;

const dateMonthYearFormatter = new Intl.DateTimeFormat(language, {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
}).format;

export const numberFormatter = new Intl.NumberFormat(language);

export const number_f000_Formatter = new Intl.NumberFormat(language, {
  maximumFractionDigits: 3,
});

export const percentFormatter = new Intl.NumberFormat(language, {
  style: 'percent',
  maximumFractionDigits: 0,
});

export const currencyFormatter = new Intl.NumberFormat(language, {
  style: 'currency',
  currency: 'USD',
});

export const compactCurrencyFormatter = new Intl.NumberFormat(language, {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

export const formatsRegistry = {
  date(date?: string) {
    return date ? dateFormatter(new Date(date)) : '';
  },
  date_month_year(date?: string) {
    return date ? dateMonthYearFormatter(new Date(date)) : '';
  },
  square_km(value: number) {
    return `${number_f000_Formatter.format(value)} km²`;
  },
  percentage_rounded(value: number) {
    return percentFormatter.format(value / 100);
  },
  currency(value: number) {
    return currencyFormatter.format(value);
  },
  compact_currency(value: number) {
    return compactCurrencyFormatter.format(value);
  },
  number(value: number) {
    return numberFormatter.format(value);
  },
  text(v: string) {
    // default format
    return '' + v;
  },
  url_domain(url: string, placeholder = 'www') {
    try {
      const domain = new URL(url).hostname.replace(/^www\./, '');
      return domain;
    } catch (_) {}
    return placeholder;
  },
};
