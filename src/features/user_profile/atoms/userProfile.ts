import { apiClient } from '~core/apiClientInstance';
import { i18n } from '~core/localization';
import { currentUserAtom } from '~core/shared_state';
import { createAtom } from '~utils/atoms';
import { createAsyncAtom } from '~utils/atoms/createAsyncAtom';
import { createStringAtom } from '~utils/atoms/createPrimitives';
import type { Action } from '@reatom/core';

// Atoms we might need
// userStateAtom
// authClientInstance

// authClientInstance
type currentProfile = {
  token?: string;
  email?: string;
  fullName?: string;
  bio?: string;
};

const dummyUser: currentProfile = {
  token: 'dumdudmdudn',
  email: 'disasterNinja@kontur.io',
  fullName: 'Daemon Ninjaki',
  bio: 'I am the disaster',
};

const dummyResponse: profileGetResponse = {
  email: 'disasterNinja@kontur.io',
  fullName: 'Daemon Ninjaki',
  bio: 'Disaster creator',
  defaultFeed: 'kontur-public',
  language: 'en',
  osmEditor: 'josm',
  subscribedToKonturUpdates: true,
  theme: 'kontur',
  useMetricUnits: true,
  username: 'dummyUser',
};

type profileGetResponse = {
  username: string;
  email: string;
  fullName: string;
  language: string;
  useMetricUnits: true;
  subscribedToKonturUpdates: true;
  bio: string;
  osmEditor: string;
  defaultFeed: string;
  theme: string;
};

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

export const pageStatusAtom = createStringAtom<'init' | 'changed' | 'loading'>('init');

export const currentProfileAtom = createAtom(
  {
    currentUserAtom,
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
        const responseData = await apiClient.get<profileGetResponse>(
          '/users/current_user',
          {},
          true,
        );
        if (!responseData) throw new Error(i18n.t('no_data_received'));
        dispatch(create('setUser', responseData));
      });
    });

    onAction('updateUserProfile', (user) => {
      schedule(async (dispatch) => {
        dispatch(pageStatusAtom.set('loading'));
        // temp dummy data
        await new Promise((res) => {
          setTimeout(() => {
            res('');
          }, 2000);
        });

        const responseData = await apiClient.put<profileGetResponse>(
          '/users/current_user',
          user,
          true,
        );
        if (!responseData) throw new Error(i18n.t('no_data_received'));
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
);
