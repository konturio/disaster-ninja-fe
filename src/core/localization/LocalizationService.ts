import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from './translations/en/common-messages.json';
import es from './translations/es/common-messages.json';
import ar from './translations/ar/common-messages.json';

export class LocalizationService {
  async init() {
    await i18n
      .use(LanguageDetector)
      .use(initReactI18next)
      .init({
        fallbackLng: 'en',
        debug: false,
        defaultNS: 'common',
        interpolation: {
          escapeValue: false,
        },
        resources: {
          en,
          es,
          ar,
        },
      });
    return i18n;
  }
}
