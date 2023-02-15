import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en_common from './translations/en/common.json';
// As files are generated only before dev/build, so from start we don't have them
// @ts-ignore
import es_common from './translations/es/common.json';
// @ts-ignore
import ar_common from './translations/ar/common.json';
// @ts-ignore
import ko_common from './translations/ko/common.json';
// @ts-ignore
import id_common from './translations/id/common.json';
// @ts-ignore
import de_common from './translations/de/common.json';
import type { TOptionsBase } from 'i18next';

export const I18N_FALLBACK_LANGUAGE = 'en';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: I18N_FALLBACK_LANGUAGE,
    debug: false,
    defaultNS: 'common',
    interpolation: {
      escapeValue: false,
    },
    contextSeparator: ':',
    pluralSeparator: ':',
    resources: {
      en: { common: en_common },
      es: { common: es_common },
      ar: { common: ar_common },
      ko: { common: ko_common },
      id: { common: id_common },
      de: { common: de_common },
    },
  });

export const TranslationService = {
  t: (key: string, options?: TOptionsBase) => {
    // the only one place we need to pass a variable to i18n.t function
    // eslint-disable-next-line i18n-checker/key-must-be-literal
    const translation = i18n.t(key, options);
    if (typeof translation === 'string') return translation;
    console.error(`Not supported translation result for key: ${key}`);
    return key;
  },
  instance: i18n,
};
