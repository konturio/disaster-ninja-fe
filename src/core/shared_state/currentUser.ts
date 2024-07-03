import { createAtom } from '~utils/atoms';
import { configRepo } from '~core/config';
import type { CurrentUser } from '~core/app/user';

export const currentUserAtom = createAtom(
  {
    setUser: (user: CurrentUser = configRepo.get().initialUser) => user,
  },
  ({ onAction }, state: CurrentUser = configRepo.get().initialUser) => {
    onAction('setUser', (usr) => {
      if (usr) {
        state = usr;
      } else {
        state = configRepo.get().initialUser;
      }
    });

    return state;
  },
  '[Shared state] currentUserAtom',
);
