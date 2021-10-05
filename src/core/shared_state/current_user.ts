import { createAtom } from '@reatom/core';

export interface CurrentUser {
  id: string;
  defaultLayers: string[];
}

const defaultUser: CurrentUser = {
  id: 'public',
  defaultLayers: [],
};

export const currentUserAtom = createAtom(
  {
    setCurrentUser: (currentUser: CurrentUser) => currentUser,
  },
  ({ onAction }, state: CurrentUser = defaultUser) => {
    onAction('setCurrentUser', (currentUser) => (state = currentUser));
    return state;
  },
);
