import { createAtom } from '~utils/atoms';
import { layersSettingsAtom } from '~core/logical_layers/atoms/layersSettings';
import { layersRegistryAtom } from '~core/logical_layers/atoms/layersRegistry';

export type CurrentUser = {
  id?: string;
  defaultLayers?: string[];
  username?: string;
  email?: string;
  token?: string;
  firstName?: string;
  lastName?: string;
};

const publicUser: CurrentUser = {
  id: 'public',
};

export const currentUserAtom = createAtom(
  {
    setUser: (user?: CurrentUser) => user,
  },
  (
    { onAction, onInit, schedule, create, getUnlistedState },
    state: CurrentUser = publicUser,
  ) => {
    onAction('setUser', (usr) => {
      if (usr) {
        state = usr;
      } else {
        state = publicUser;
      }

      // remove all ownByUser layers from map
      const settingsRegistryKeys = Array.from(
        getUnlistedState(layersSettingsAtom),
      )
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
