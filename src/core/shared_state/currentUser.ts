import { createBindAtom } from '~utils/atoms/createBindAtom';

export interface CurrentUser {
  id: string;
  defaultLayers: string[];
}

const defaultUser: CurrentUser = {
  id: 'public',
  defaultLayers: [],
};

export const currentUserAtom = createBindAtom(
  {
    setCurrentUser: (currentUser: CurrentUser) => currentUser,
  },
  ({ onAction }, state: CurrentUser = defaultUser) => {
    onAction('setCurrentUser', (currentUser) => (state = currentUser));
    return state;
  },
  '[Shared state] currentUserAtom',
);
