import { apiClient } from '~core/apiClientInstance';
import { i18n } from '~core/localization';
import { currentUserAtom } from '~core/shared_state';
import { createAtom } from '~utils/atoms';
import { createStringAtom } from '~utils/atoms/createPrimitives';
import { userResourceAtom } from '~core/auth/atoms/userResource';
import appConfig from '~core/app_config';
import { currentNotificationAtom } from '~core/shared_state';
import type { Action } from '@reatom/core';

export type UserProfileState = {
  username?: string;
  email?: string;
  fullName?: string;
  language?: string;
  useMetricUnits?: boolean;
  subscribedToKonturUpdates?: boolean;
  bio?: string;
  osmEditor?: string;
  defaultFeed?: string;
  theme?: string;
  loading?: boolean;
};

type profileResponse = UserProfileState;

export const pageStatusAtom = createStringAtom<'init' | 'changed' | 'loading'>(
  'init',
  'user_profile:pageStatusAtom',
);

// defaults, not provided by api/missing in profile
export const defaultUserProfileData = {
  username: '',
  email: '',
  fullName: '',
  language: 'en',
  useMetricUnits: true,
  subscribedToKonturUpdates: false,
  bio: '',
  osmEditor: appConfig.osmEditors[0].id,
  defaultFeed: appConfig.defaultFeedObject.feed,
  theme: 'kontur',
};

export const currentProfileAtom = createAtom(
  {
    currentUserAtom,
    userResourceAtom,
    setUser: (user: UserProfileState) => user,
    getUserProfile: () => {
      // noop
    },
    updateUserProfile: (user: UserProfileState) => user,
  },
  ({ onChange, onAction, schedule, create }, state: UserProfileState | null = null) => {
    onAction('getUserProfile', () => {
      schedule(async (dispatch) => {
        dispatch(pageStatusAtom.set('loading'));

        const responseData = await apiClient.get<profileResponse>(
          '/users/current_user',
          {},
          true,
        );
        if (!responseData) throw new Error(i18n.t('no_data_received'));

        const res = { ...defaultUserProfileData, ...responseData };

        dispatch(create('setUser', res));
      });
    });

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

        i18n.instance
          .changeLanguage(user.language)
          .then((r) => {
            location.reload();
          })
          .catch((e) => {
            console.error(e);
          });

        dispatch(create('setUser', responseData));
      });
    });

    onAction('setUser', (user) => {
      pageStatusAtom.set('init');
      state = user;
    });

    onChange('currentUserAtom', async (newUser, prevUser) => {
      const actions: Action[] = [];
      if (newUser.id === 'public') return actions.push(create('setUser', {}));

      actions.push(create('getUserProfile'));
      schedule((dispatch) => dispatch(actions));
    });

    return state;
  },
  'user_profile:currentProfileAtom',
);
