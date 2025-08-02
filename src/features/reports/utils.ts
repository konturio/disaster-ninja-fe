import { i18n } from '~core/localization';

export type TranslatableString = string | Record<string, string>;

export function translateReportField(value: TranslatableString | undefined): string {
  if (!value) return '';
  if (typeof value === 'string') return value;
  const lang = i18n.instance.language;
  return value[lang] ?? value.en ?? Object.values(value)[0] ?? '';
}
