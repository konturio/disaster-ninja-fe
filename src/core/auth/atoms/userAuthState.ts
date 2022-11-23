import { createAtom } from '~core/store/atoms';
import { UserStateStatus } from '../constants';
import type { Store } from '@reatom/core';
import type { UserStateType } from '~core/auth/types';

export const createUserAuthStateAtom = (store: Store) =>
  createAtom(
    {
      setState: (state: UserStateType) => state,
      authorize: () => null,
      reset: () => null,
      login: () => null,
      logout: () => null,
      signup: () => null,
      passwordReset: () => null,
    },
    ({ onAction }, state: UserStateType = UserStateStatus.UNAUTHORIZED) => {
      onAction('setState', (st) => {
        if (state !== st) {
          state = st;
        }
      });

      onAction('authorize', () => {
        if (state !== UserStateStatus.AUTHORIZED) {
          state = UserStateStatus.AUTHORIZED;
        }
      });

      onAction('reset', () => {
        if (state !== UserStateStatus.UNAUTHORIZED) {
          state = UserStateStatus.UNAUTHORIZED;
        }
      });

      onAction('login', () => {
        if (
          state === UserStateStatus.UNAUTHORIZED ||
          state === UserStateStatus.SIGNING_UP
        ) {
          state = UserStateStatus.LOGGING_IN;
        }
      });

      onAction('logout', () => {
        if (
          state === UserStateStatus.AUTHORIZED ||
          state === UserStateStatus.PASSWORD_RESET
        ) {
          state = UserStateStatus.UNAUTHORIZED;
        }
      });

      onAction('signup', () => {
        if (
          state === UserStateStatus.UNAUTHORIZED ||
          state === UserStateStatus.LOGGING_IN
        ) {
          state = UserStateStatus.SIGNING_UP;
        }
      });

      onAction('passwordReset', () => {
        if (state === UserStateStatus.AUTHORIZED) {
          state = UserStateStatus.PASSWORD_RESET;
        }
      });

      return state;
    },
    {
      id: '[Shared state] userAuthStateAtom',
      store,
    },
  );
