import { i18n } from '~core/localization';
import { isNumber, toCapitalizedList } from '~utils/common';

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

const dateWithTimezoneFormatter = new Intl.DateTimeFormat(language, {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  timeZoneName: 'short',
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

function formatFileSize(sizeBytes: number): string {
  if (sizeBytes > 1000000000) {
    return `${Number.parseFloat((sizeBytes / 1000000000).toFixed(2))} GB`;
  }
  if (sizeBytes > 1000000) {
    return `${Number.parseFloat((sizeBytes / 1000000).toFixed(2))} MB`;
  }
  if (sizeBytes > 1000) {
    return `${Number.parseFloat((sizeBytes / 1000).toFixed(2))} KB`;
  }
  return `${Number.parseFloat((sizeBytes / 1000).toFixed(2))} B`;
}

function formatDistancePerPixel(metersPerPixel: number) {
  if (metersPerPixel > 1000) {
    return `${Number.parseFloat((metersPerPixel / 1000).toFixed(3))} km/px`;
  }
  if (metersPerPixel < 1) {
    return `${Number.parseFloat((metersPerPixel * 100).toFixed(3))} cm/px`;
  }
  return `${Number.parseFloat(metersPerPixel.toFixed(3))} m/px`;
}

const formatDatesInterval = (dateStart?: string, dateEnd?: string) => {
  const startFormatted = dateStart ? formatsRegistry.date_month_year(dateStart) : null;
  const endFormatted = dateEnd ? formatsRegistry.date_month_year(dateEnd) : null;
  if (startFormatted) {
    if (endFormatted && endFormatted !== startFormatted) {
      return `${startFormatted} - ${endFormatted}`;
    } else {
      return startFormatted;
    }
  } else if (endFormatted) {
    return endFormatted;
  }
  return '';
};

export const formatsRegistry = {
  date(date?: string) {
    return date ? dateFormatter(new Date(date)) : '';
  },
  date_month_year(date?: string) {
    return date ? dateMonthYearFormatter(new Date(date)) : '';
  },
  date_timezone(date?: string) {
    return date ? dateWithTimezoneFormatter(new Date(date)) : '';
  },
  dates_interval(datesInterval: { dateStart?: string; dateEnd?: string }) {
    return formatDatesInterval(datesInterval.dateStart, datesInterval.dateEnd);
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
  file_size(sizeInBytes?: any) {
    return isNumber(sizeInBytes) ? formatFileSize(sizeInBytes) : String(sizeInBytes);
  },
  distance_per_pixel(metersPerPixel?: any) {
    return isNumber(metersPerPixel)
      ? formatDistancePerPixel(metersPerPixel)
      : String(metersPerPixel);
  },
  capitalized_list(values?: string[]) {
    return values ? toCapitalizedList(values) : '';
  },
  list(values?: string[]) {
    return values?.length ? values.join(', ') : '';
  },
  hash_id(value?: string | number) {
    return value ? `#${value}` : '';
  },
};
