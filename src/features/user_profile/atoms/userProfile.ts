import { i18n } from '~core/localization';
import { currentUserAtom } from '~core/shared_state';
import { createAtom } from '~utils/atoms';
import { createStringAtom } from '~utils/atoms/createPrimitives';
import { currentNotificationAtom } from '~core/shared_state';
import { getCurrentUser, updateCurrentUser } from '~core/api/users';
import { configRepo } from '~core/config';
import type { UserDto } from '~core/app/user';

export const pageStatusAtom = createStringAtom<'init' | 'ready' | 'changed' | 'loading'>(
  'init',
  'user_profile:pageStatusAtom',
);

export const currentProfileAtom = createAtom(
  {
    currentUserAtom,
    getUserProfile: () => null,
    updateUserProfile: (user: UserDto) => user,
  },
  ({ onChange, onAction, schedule }, state: UserDto = configRepo.get().initialUser) => {
    onAction('getUserProfile', () => {
      schedule(async (dispatch) => {
        dispatch(pageStatusAtom.set('init'));
        const user = await getCurrentUser();
        if (!user) throw new Error(i18n.t('no_data_received'));
        dispatch(pageStatusAtom.set('ready'));
        state = user;
        dispatch(currentUserAtom.setUser(user));
      });
    });

    onAction('updateUserProfile', (user) => {
      schedule(async (dispatch) => {
        dispatch(pageStatusAtom.set('loading'));
        const responseData = await updateCurrentUser(user);
        if (!responseData) throw new Error(i18n.t('no_data_received'));
        currentNotificationAtom.showNotification.dispatch(
          'success',
          { title: i18n.t('profile.successNotification') },
          5,
        );
        // reload to apply all the settings
        location.reload();
      });
    });

    onChange('currentUserAtom', async (newUser, prevUser) => {
      const { loading, defaultLayers, ...newState } = newUser;
      state = newState;
    });

    return state;
  },
  'user_profile:currentProfileAtom',
);
