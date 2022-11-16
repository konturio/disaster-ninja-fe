export { TranslationService as i18n } from './TranslationService';
export { LocaleNumber } from './Locale';
import { forceRun } from '~utils/atoms/forceRun';
import { languageWatcherAtom } from './atoms/languageWatcher';
forceRun(languageWatcherAtom);
