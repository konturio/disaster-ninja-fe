import { createAtom } from '~utils/atoms';
import { currentUserAtom } from '~core/shared_state';
import { i18n } from '~core/localization';

export const currentLanguageAtom = createAtom(
  {
    currentUserAtom,
  },
  ({ onChange }, state = 'en') => {
    onChange('currentUserAtom', (newUser, prevUser) => {
      const userLanguage = newUser.language;
      if (userLanguage && i18n.instance.language !== userLanguage) {
        i18n.instance
          .changeLanguage(userLanguage)
          .catch((e) =>
            console.warn(`Attempt to change language to ${userLanguage} failed`),
          );
        // TODO: set <html lang= dir=
        state = userLanguage;
      }
    });

    return state;
  },
  'currentLanguageAtom',
);
