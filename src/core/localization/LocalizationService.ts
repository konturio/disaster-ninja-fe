import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from './translations/en/common-messages.json';
import es from './translations/es/common-messages.json';
import ar from './translations/ar/common-messages.json';
import type { i18n as OrigI18n } from 'i18next';

export type I18n = Omit<OrigI18n, 't'> & { t: (key: string) => string} 

// Avoid undefined 
function fallbackToKey(i18n: OrigI18n): I18n {
  const originalT = i18n.t;
  i18n.t = (key: string) => originalT(key) ?? key;
  return i18n;
} 


export class LocalizationService {
  i18n!: I18n
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

    this.i18n = fallbackToKey(i18n);
    return this.i18n;
  }
}
