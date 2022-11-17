import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { currentUserAtom } from '~core/shared_state';
import en_common from './translations/en/common.json';
// As files are generated only before dev/build, so from start we don't have them
// @ts-ignore
import es_common from './translations/es/common.json';
// @ts-ignore
import ar_common from './translations/ar/common.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
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
    },
  });

export const TranslationService = {
  t: (key: string) => {
    // the only one place we need to pass a variable to i18n.t function
    // eslint-disable-next-line i18n-checker/key-must-be-literal
    const translation = i18n.t(key);
    if (typeof translation === 'string') return translation;
    console.error(`Not supported translation result for key: ${key}`);
    return key;
  },
  instance: i18n,
};

currentUserAtom.subscribe(({ language }) => {
  i18n
    .changeLanguage(language)
    .catch((e) => console.warn(`Attempt to change language to ${language} failed`));
});
