import { describe, it, expect, afterAll } from 'vitest';
import { i18n } from '~core/localization';
import { translateReportField } from './utils';

describe('translateReportField', () => {
  afterAll(async () => {
    await i18n.instance.changeLanguage('en');
  });

  it('returns string value as-is', () => {
    expect(translateReportField('plain'), 'should return string unchanged').toBe('plain');
  });

  it('returns value for current language', async () => {
    await i18n.instance.changeLanguage('es');
    const field = { en: 'Hello', es: 'Hola' };
    expect(translateReportField(field), 'should pick Spanish translation').toBe('Hola');
  });

  it('falls back to english when language missing', async () => {
    await i18n.instance.changeLanguage('de');
    const field = { en: 'Hello' };
    expect(translateReportField(field), 'should fall back to English').toBe('Hello');
  });
});
