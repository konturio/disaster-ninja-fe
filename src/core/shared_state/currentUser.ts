import { createAtom } from '~utils/atoms';
import { layersSettingsAtom } from '~core/logical_layers/atoms/layersSettings';
import { layersRegistryAtom } from '~core/logical_layers/atoms/layersRegistry';
import { PUBLIC_USER_ID } from '~core/auth/constants';
import appConfig from '~core/app_config';

export type CurrentUser = {
  id?: string;
  defaultLayers?: string[];
  username?: string;
  email?: string;
  token?: string;
  firstName?: string;
  lastName?: string;
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

const publicUser: CurrentUser = {
  id: PUBLIC_USER_ID,
  osmEditor: appConfig.osmEditors[0].id,
  defaultFeed: appConfig.defaultFeedObject.feed,
  useMetricUnits: true,
};

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

export const currentUserAtom = createAtom(
  {
    setUser: (user?: CurrentUser) => user,
  },
  ({ onAction, schedule, getUnlistedState }, state: CurrentUser = publicUser) => {
    onAction('setUser', (usr) => {
      if (usr) {
        state = usr;
      } else {
        state = publicUser;
      }
      state = { ...defaultUserProfileData, ...state };
      // remove all ownByUser layers from map
      const settingsRegistryKeys = Array.from(getUnlistedState(layersSettingsAtom))
        .filter(([, val]) => val?.data?.ownedByUser)
        .map(([key]) => key);

      if (!settingsRegistryKeys.length) return;

      const registeredAtoms = Array.from(getUnlistedState(layersRegistryAtom))
        .filter(([key]) => settingsRegistryKeys.includes(key))
        .map(([key, val]) => val);

      if (!registeredAtoms.length) return;

      const actions = registeredAtoms.map((lr) => lr.destroy());
      schedule((dispatch) => {
        dispatch(actions);
      });
    });

    return state;
  },
  '[Shared state] currentUserAtom',
);
