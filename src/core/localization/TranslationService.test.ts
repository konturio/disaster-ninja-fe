import { describe, expect, it, test } from 'vitest';
import { TranslationService } from './TranslationService';

describe('TranslationService.getSupportedLanguage()', () => {
  describe('getSupportedLanguage()', () => {
    it('should return first supported language from preferredLanguages parameter', () => {
      const userLanguages = ['fi', 'es', 'ar'];
      const fallbackLanguage = 'en';
      expect(
        TranslationService.getSupportedLanguage(userLanguages, fallbackLanguage),
      ).toEqual('es');
    });

    it('should ignore country codes', () => {
      const userLanguages = ['fi', 'es-MX', 'ar'];
      const fallbackLanguage = 'en';
      expect(
        TranslationService.getSupportedLanguage(userLanguages, fallbackLanguage),
      ).toEqual('es');
    });

    it('should return fallback language if none of the preferred langiages is supported', () => {
      const userLanguages = ['fi', 'lv'];
      const fallbackLanguage = 'en';
      expect(
        TranslationService.getSupportedLanguage(userLanguages, fallbackLanguage),
      ).toEqual('en');
    });
  });
});
