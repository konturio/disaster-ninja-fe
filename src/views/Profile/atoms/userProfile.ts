import { apiClient } from '~core/apiClientInstance';
import { authClientInstance } from '~core/authClientInstance';
import { i18n } from '~core/localization';
import { currentUserAtom } from '~core/shared_state';
import { createResourceAtom } from '~utils/atoms';

// Atoms we might need
// userStateAtom
// authClientInstance

// authClientInstance
type currentProfile = {
  token?: string;
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

export const currentProfileAtom = createAtom(
  {
    currentUserAtom,
  },
  ({ get }, state: currentProfile = {}) => {
    const newState: currentProfile = {};
    const currentUser = get('currentUserAtom');

    newState.token = currentUser.token;
    state = newState;
    // console.log('%c⧭ state'  , 'color: #00736b', state);
    return state;
  },
);

export const profileResourceAtom = createResourceAtom(
  (profile) => {
    if (!profile) return null;
    const responseData = await userProfileClient.get<profileGetResponse>(
      '/users/current_user',
      undefined,
      true,
    );
    // console.log('%c⧭ responseData', 'color: #99614d', responseData);
    if (responseData === undefined) throw new Error(i18n.t('no_data_received'));
    return responseData;
  },
  'profileResourceAtom',
  currentProfileAtom,
);
