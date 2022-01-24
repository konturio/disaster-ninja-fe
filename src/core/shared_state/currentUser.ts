import { createBindAtom } from '~utils/atoms/createBindAtom';
import appConfig from '~core/app_config';

export interface CurrentUser {
  id: string;
  defaultLayers: string[];
}

export const currentUserAtom = createBindAtom(
  {
    setCurrentUser: (currentUser: CurrentUser) => currentUser,
  },
  (
    { onAction, onInit, schedule, create },
    state: CurrentUser | null = null,
  ) => {
    // Imitate current user update
    // Delete this when login feature be ready
    onInit(() => {
      schedule((dispatch) => {
        dispatch(
          create('setCurrentUser', {
            id: 'public',
            defaultLayers: appConfig.layersByDefault ?? [],
          }),
        );
      });
    });

    onAction('setCurrentUser', (currentUser) => (state = currentUser));

    return state;
  },
  '[Shared state] currentUserAtom',
);
