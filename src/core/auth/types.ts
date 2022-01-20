export type CurrentUser = {
  username: string;
  email: string;
  token: string;
  firstName: string;
  lastName: string;
};

export type UserWithAuth = { userState: 'unauthorized' | 'logging_in' | 'signing_up' }
| ({ userState: 'authorized' |  'password_reset' } & CurrentUser);
