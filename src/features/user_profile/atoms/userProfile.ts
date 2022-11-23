import core from '~core/index';
import { createAtom } from '~core/store/atoms';
import { createStringAtom } from '~core/store/atoms/createPrimitives';
import { currentNotificationAtom } from '~core/shared_state';
import type { UserProfile, UserProfilesResponse } from '~core/current_user/types';

export const pageStatusAtom = createStringAtom<'init' | 'changed' | 'loading'>(
  'init',
  'user_profile:pageStatusAtom',
);

export const currentProfileAtom = createAtom(
  {
    currentUserAtom: core.currentUser.atom,
    updateUserProfile: (user: UserProfile) => user,
  },
  ({ onAction, schedule, get }, state: UserProfile | null = null) => {
    onAction('updateUserProfile', (user) => {
      schedule(async (dispatch) => {
        dispatch(pageStatusAtom.set('loading'));
        const responseData = await core.api.apiClient.put<UserProfilesResponse>(
          '/users/current_user',
          user,
          true,
        );
        if (!responseData) throw new Error(core.i18n.t('no_data_received'));
        currentNotificationAtom.showNotification.dispatch(
          'success',
          { title: core.i18n.t('profile.successNotification') },
          5,
        );

        dispatch(core.currentUser.atom.setUserProfile(user));
      });
    });

    return get('currentUserAtom');
  },
  'user_profile:currentProfileAtom',
);
