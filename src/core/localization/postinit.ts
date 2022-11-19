import i18n from 'i18next';
import { currentUserAtom } from '~core/shared_state/currentUser';

currentUserAtom.subscribe(({ language }) => {
  i18n
    .changeLanguage(language)
    .catch((e) => console.warn(`Attempt to change language to ${language} failed`));
});

// TODO: enable after init when user profile lang settings is available
