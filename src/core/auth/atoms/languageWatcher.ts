import { createAtom } from '~utils/atoms';
import { currentUserAtom } from '~core/shared_state';
import { i18n } from '~core/localization';
import { forceRun } from '~utils/atoms/forceRun';

const languageWatcher = createAtom(
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
  '[Shared state] userStateAtom',
);

export function initLanguageWatcher() {
  forceRun(languageWatcher);
}
