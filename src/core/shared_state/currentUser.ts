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

export type UserWithAuth = { userState: 'unauthorized' | 'logging_in' | 'signing_up' }
  | ({ userState: 'authorized' |  'password_reset' } & CurrentUser);

const publicUser = {
  id: 'public',
  defaultLayers: appConfig.layersByDefault ?? [],
};

const UNAUTHORIZED_STATE: UserWithAuth = { ...publicUser, userState: 'unauthorized' };
const LOGIN_STATE: UserWithAuth = { userState: 'logging_in' };
const SING_UP_STATE: UserWithAuth = { userState: 'signing_up' };

export const currentUserAtom = createBindAtom(
  {
    setUser: (user: CurrentUser) => user,
    reset: () => null,
    login: () => null,
    logout: () => null,
    signup: () => null,
    passwordReset: () => null,
  },
  (
    { onAction, onInit, schedule, create },
    state: UserWithAuth = UNAUTHORIZED_STATE,
  ) => {
    onAction('setUser', (usr) => {
      if (usr) {
        state = { ...usr, userState: usr.id !== 'public' ? 'authorized' : 'unauthorized' };
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
  '[Shared state] currentUserAtom',
);
