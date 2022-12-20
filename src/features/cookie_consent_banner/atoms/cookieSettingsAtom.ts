import { cookieManagementService } from '~core/cookie_settings';
import { createAtom } from '~utils/atoms';

export const cookieSettingsAtom = createAtom(
  {
    acceptAll: () => null,
    rejectAll: () => null,
    _set: (havePrompts: boolean) => havePrompts,
  },
  ({ onAction, onInit, schedule, create }, state = false) => {
    onInit(() => {
      schedule((dispatch) => {
        cookieManagementService.onPermissionsChange(() => {
          dispatch(create('_set', cookieManagementService.havePrompts()));
        });
      });
    });

    onAction('_set', (newState) => {
      state = newState;
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
