import { createResourceAtom } from '~utils/atoms';
import { apiClient } from '~core/index';
import { UserDataModel } from '~core/auth';

export const userResourceAtom = createResourceAtom<undefined, UserDataModel | undefined>(
  null,
  async () => {
    const responseData = await apiClient.get<any>( '/user', undefined, false);
    if (!responseData) {
      throw new Error('No user data received');
    }

    const userData = new UserDataModel();
    Object.assign(userData, responseData);
    return userData;
  },
  'userResourceAtom',
);
