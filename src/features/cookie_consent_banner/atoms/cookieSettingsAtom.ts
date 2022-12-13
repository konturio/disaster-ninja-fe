import { cookieManagementService } from '~core/cookie_settings';
import { createAtom } from '~utils/atoms';

export const cookieSettingsAtom = createAtom(
  {
    acceptAll: () => null,
    rejectAll: () => null,
  },
  ({ onAction, onInit, get, schedule }, state = false) => {
    onInit(() => {
      state = cookieManagementService.havePrompts();
    });

    onAction('acceptAll', () => {
      schedule((dispatch) => {
        cookieManagementService.acceptAll();
      });
    });

    onAction('rejectAll', () => {
      schedule((dispatch) => {
        cookieManagementService.rejectAll();
      });
    });

    return state;
  },
  'cookieSettingsAtom',
);
