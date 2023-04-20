import { apiClient } from '~core/apiClientInstance';
import { i18n } from '~core/localization';
import { currentUserAtom } from '~core/shared_state';
import { createAtom } from '~utils/atoms';
import { createStringAtom } from '~utils/atoms/createPrimitives';
import { currentNotificationAtom } from '~core/shared_state';
import { publicUser } from '~core/app/user';
import type { CurrentUser } from '~core/app/user';

export type UserProfileState = Omit<CurrentUser, 'loading' | 'defaultLayers' | 'token'>;
type profileResponse = UserProfileState;

export const pageStatusAtom = createStringAtom<'init' | 'changed' | 'loading'>(
  'init',
  'user_profile:pageStatusAtom',
);

export const currentProfileAtom = createAtom(
  {
    currentUserAtom,
    updateUserProfile: (user: UserProfileState) => user,
  },
  ({ onChange, onAction, schedule }, state: UserProfileState = publicUser) => {
    onAction('updateUserProfile', (user) => {
      schedule(async (dispatch) => {
        dispatch(pageStatusAtom.set('loading'));
        const responseData = await apiClient.put<profileResponse>(
          '/users/current_user',
          user,
          true,
        );
        if (!responseData) throw new Error(i18n.t('no_data_received'));
        currentNotificationAtom.showNotification.dispatch(
          'success',
          { title: i18n.t('profile.successNotification') },
          5,
        );

        dispatch(currentUserAtom.setUser(user));
      });
    });

    onChange('currentUserAtom', async (newUser, prevUser) => {
      // reload to simply apply all the settings if implementation is difficult
      if (prevUser) location.reload();

      const { loading, defaultLayers, ...newState } = newUser;
      state = newState;
    });

    return state;
  },
  'user_profile:currentProfileAtom',
);
