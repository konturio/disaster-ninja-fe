import { createResourceAtom } from '~utils/atoms';
import { apiClient } from '~core/index';
import { currentUserAtom, UserWithAuth } from '~core/shared_state/currentUser';
import { UserDataModel } from '~core/auth';

export const userResourceAtom = createResourceAtom<UserWithAuth | null, UserDataModel | undefined>(
  currentUserAtom,
  async (userState) => {
    console.log('fetch user data', userState);
    const responseData = await apiClient.get<unknown>( '/user', undefined, false);
    if (!responseData) {
      throw new Error('No user data received');
    }

    const userData = new UserDataModel();
    Object.assign(userData, responseData);
    return userData;
  },
  'userResourceAtom',
);
