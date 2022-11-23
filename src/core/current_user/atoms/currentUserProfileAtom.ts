import { createAsyncAtom } from '~core/store/atoms/createAsyncAtom';
import { UserStateStatus } from '~core/auth';
import { createAtom } from '~core/store/atoms';
import type { Store } from '@reatom/core';
import type { AuthenticationService } from '~core/auth';
import type { ApiClient } from '~core/api_client';
import type { UserProfile, UserProfilesResponse } from '../types';

export const createCurrentUserProfileAtom = (
  store: Store,
  client: ApiClient,
  authAtom: AuthenticationService['atom'],
  getPublicProfile: () => UserProfilesResponse,
) => {
  const currentUserResource = createAsyncAtom(
    authAtom,
    async (userState, abortController) => {
      if (userState === UserStateStatus.AUTHORIZED) {
        return client.get<UserProfilesResponse>('/users/current_user', {}, true, {
          signal: abortController.signal,
        });
      } else {
        return getPublicProfile();
      }
    },
    'currentUserProfileResource',
    { store },
  );

  return createAtom(
    { currentUserResource, setUserProfile: (profile: UserProfile) => profile },
    ({ get, onAction }, state: UserProfile | null = null) => {
      state = get('currentUserResource').data;
      onAction('setUserProfile', (profile) => {
        state = profile
      });
      return state;
    },
    {
      id: 'currentUserProfile',
      store,
    },
  );
};

export type ProfileAtom = ReturnType<typeof createCurrentUserProfileAtom>;
