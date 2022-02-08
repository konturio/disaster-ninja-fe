import { createBindAtom } from '~utils/atoms/createBindAtom';
import appConfig from '~core/app_config';

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
  defaultLayers: appConfig.layersByDefault ?? [],
};

export const currentUserAtom = createBindAtom(
  {
    setUser: (user?: CurrentUser) => user,
  },
  (
    { onAction, onInit, schedule, create },
    state: CurrentUser = publicUser,
  ) => {
    onAction('setUser', (usr) => {
      if (usr) {
        state = usr;
      } else {
        state = publicUser;
      }
    });

    return state;
  },
  '[Shared state] currentUserAtom',
);
