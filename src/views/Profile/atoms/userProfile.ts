import { apiClient } from '~core/apiClientInstance';
import { i18n } from '~core/localization';
import { currentUserAtom } from '~core/shared_state';
import { createAtom, createResourceAtom } from '~utils/atoms';

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
  async (profile) => {
    // TODO - change to createAsyncAtom
    if (!profile) return null;
    const responseData = await apiClient.get<profileGetResponse>(
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
