import { createAtom } from '~utils/atoms';
import { currentUserAtom } from '~core/shared_state';
import { i18n } from '~core/localization';
import { forceRun } from '~utils/atoms/forceRun';

export const languageWatcherAtom = createAtom(
  {
    currentUserAtom,
  },
  ({ onChange }, state = null) => {
    onChange('currentUserAtom', (newUser, prevUser) => {
      const userLanguage = newUser.language;
      if (userLanguage && i18n.instance.language !== userLanguage) {
        i18n.instance
          .changeLanguage(userLanguage)
          .catch((e) =>
            console.warn(`Attempt to change language to ${userLanguage} failed`),
          );
      }
    });
    return state;
  },
  'languageWatcherAtom',
);

export function initLanguageWatcher() {
  forceRun(languageWatcherAtom);
}
