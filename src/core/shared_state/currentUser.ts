import { createAtom } from '~utils/atoms';
import { layersSettingsAtom } from '~core/logical_layers/atoms/layersSettings';
import { layersRegistryAtom } from '~core/logical_layers/atoms/layersRegistry';
import { configRepo } from '~core/config';
import type { CurrentUser } from '~core/app/user';

export const currentUserAtom = createAtom(
  {
    setUser: (user: CurrentUser = configRepo.get().initialUser) => user,
  },
  (
    { onAction, schedule, getUnlistedState },
    state: CurrentUser = configRepo.get().initialUser,
  ) => {
    onAction('setUser', (usr) => {
      if (usr) {
        state = usr;
      } else {
        state = configRepo.get().initialUser;
      }
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
