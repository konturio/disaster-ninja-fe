import { createAtom } from '~utils/atoms';
import { currentUserAtom } from '~core/shared_state';
import { i18n } from '~core/localization';

export const languageWatcherAtom = createAtom(
  {
    currentUserAtom,
  },
  ({ onChange }, state = null) => {
    onChange('currentUserAtom', (newUser, prevUser) => {
      const userLanguage = newUser.language;
      if (userLanguage && i18n.instance.language !== userLanguage) {
        i18n.instance.changeLanguage(userLanguage).catch((e) => {
          console.error(e);
        });
      }
    });
    return state;
  },
  'languageWatcherAtom',
);
