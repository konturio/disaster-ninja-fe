import { createBindAtom } from '~utils/atoms';
import { CurrentUser, UserWithAuth } from '~core/auth/types';

const UNAUTHORIZED_STATE: UserWithAuth = { userState: 'unauthorized' };
const LOGIN_STATE: UserWithAuth = { userState: 'logging_in' };
const SING_UP_STATE: UserWithAuth = { userState: 'signing_up' };

export const currentUserAtom = createBindAtom(
  {
    setUser: (user?: CurrentUser) => user,
    reset: () => null,
    login: () => null,
    logout: () => null,
    signup: () => null,
    passwordReset: () => null,
  },
  ({ onAction }, state: UserWithAuth = UNAUTHORIZED_STATE) => {
    onAction('setUser', (usr) => {
      if (usr) {
        state = { ...usr, userState: 'authorized' };
      } else {
        state = UNAUTHORIZED_STATE;
      }
    });

    onAction('reset', () => {
      if (state.userState !== 'unauthorized') {
        state = UNAUTHORIZED_STATE;
      }
    });

    onAction('login', () => {
      if (state.userState === 'unauthorized' || state.userState === 'signing_up') {
        state = LOGIN_STATE;
      }
    });

    onAction('logout', () => {
      if (state.userState === 'authorized' || state.userState === 'password_reset') {
        state = UNAUTHORIZED_STATE;
      }
    });

    onAction('signup', () => {
      if (state.userState === 'unauthorized' || state.userState === 'logging_in') {
        state = SING_UP_STATE;
      }
    });

    onAction('passwordReset', () => {
      if (state.userState === 'authorized') {
        state = { ...state, userState: 'password_reset' };
      }
    });

    return state;
  },
);

