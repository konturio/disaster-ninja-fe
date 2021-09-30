import { createAtom } from '@reatom/core';

export interface CurrentUser {
  id: string;
}

const defaultUser: CurrentUser = {
  id: 'public',
};

export const currentCurrentUserAtom = createAtom(
  {
    setCurrentCurrentUser: (currentUser: CurrentUser) => currentUser,
  },
  ({ onAction }, state: CurrentUser = defaultUser) => {
    onAction('setCurrentCurrentUser', (currentUser) => (state = currentUser));
    return state;
  },
);
