import { i18n } from '~core/localization';
import { configRepo } from '~core/config';

const LANGUAGES = ['en', 'es', 'ar', 'ko', 'id', 'de', 'uk'] as const;
export type Lng = (typeof LANGUAGES)[number];

const getLocaleTranslations = (lng: Lng): [string, string] => {
  switch (lng) {
    case 'en':
      return [
        i18n.t('profile.languageOption.en'),
        i18n.t('profile.languageOption.en', { lng }),
      ];
    case 'es':
      return [
        i18n.t('profile.languageOption.es'),
        i18n.t('profile.languageOption.es', { lng }),
      ];
    case 'ar':
      return [
        i18n.t('profile.languageOption.ar'),
        i18n.t('profile.languageOption.ar', { lng }),
      ];
    case 'ko':
      return [
        i18n.t('profile.languageOption.ko'),
        i18n.t('profile.languageOption.ko', { lng }),
      ];
    case 'id':
      return [
        i18n.t('profile.languageOption.id'),
        i18n.t('profile.languageOption.id', { lng }),
      ];
    case 'de':
      return [
        i18n.t('profile.languageOption.de'),
        i18n.t('profile.languageOption.de', { lng }),
      ];
    case 'uk':
      return [
        i18n.t('profile.languageOption.uk'),
        i18n.t('profile.languageOption.uk', { lng }),
      ];
  }
};

export const getLanguageOptions = () =>
  [...LANGUAGES].sort().map((lng) => {
    const [currentTranslation, destinationTranslation] = getLocaleTranslations(lng);

    return {
      title:
        lng === i18n.instance.language
          ? currentTranslation
          : `${currentTranslation} - ${destinationTranslation}`,
      value: lng,
    };
  });

export const OPTIONS_LANGUAGE = getLanguageOptions();

export const OPTIONS_OSM = configRepo.get().osmEditors.map((o) => ({
  title: o.title,
  value: o.id,
}));

export const OPTIONS_THEME = [
  { title: i18n.t('profile.konturTheme'), value: 'kontur' },
  // { title: i18n.t('profile.HOTTheme'), value: 'hot' },
];
