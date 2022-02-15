import { createAtom } from '~utils/atoms';

export type UserStateType =
  | 'authorized'
  | 'unauthorized'
  | 'logging_in'
  | 'signing_up'
  | 'password_reset';

export const userStateAtom = createAtom(
  {
    setState: (state: UserStateType) => state,
    authorize: () => null,
    reset: () => null,
    login: () => null,
    logout: () => null,
    signup: () => null,
    passwordReset: () => null,
  },
  (
    { onAction, onInit, schedule, create },
    state: UserStateType = 'unauthorized',
  ) => {
    onAction('setState', (st) => {
      if (state !== st) {
        state = st;
      }
    });

    onAction('authorize', () => {
      if (state !== 'authorized') {
        state = 'authorized';
      }
    });

    onAction('reset', () => {
      if (state !== 'unauthorized') {
        state = 'unauthorized';
      }
    });

    onAction('login', () => {
      if (state === 'unauthorized' || state === 'signing_up') {
        state = 'logging_in';
      }
    });

    onAction('logout', () => {
      if (state === 'authorized' || state === 'password_reset') {
        state = 'unauthorized';
      }
    });

    onAction('signup', () => {
      if (state === 'unauthorized' || state === 'logging_in') {
        state = 'signing_up';
      }
    });

    onAction('passwordReset', () => {
      if (state === 'authorized') {
        state = 'password_reset';
      }
    });

    return state;
  },
  '[Shared state] userStateAtom',
);
