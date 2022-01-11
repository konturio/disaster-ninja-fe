export type CurrentUser = {
  name: string;
  token: string;
};

export type UserWithAuth = { userState: 'unauthorized' | 'logging_in' | 'signing_up' }
| ({ userState: 'authorized' |  'password_reset' } & CurrentUser);
