import MockAdapter from 'axios-mock-adapter';
import sinon from 'sinon';
import {
  createLocalStorageMock,
  setupTestContext,
} from '~utils/test_utils/setupTest';
import { ApiClientError } from '../apiClientError';
import { ApiClient } from '../apiClient';
import { base64UrlDecode, base64UrlEncode } from './_tokenUtils';
import type { NotificationMessage } from '~core/types/notification';
import type { INotificationService, ITranslationService } from '../types';

function setTimeOffset(timeOffsetMin: number): number {
  return (new Date().getTime() + timeOffsetMin * 60 * 1000) / 1000;
}

function setTokenExp(token: string, time: number): string {
  const tokenSplitted = token.split('.');
  const midToken = JSON.parse(base64UrlDecode(tokenSplitted[1]));
  midToken.exp = time;
  tokenSplitted[1] = base64UrlEncode(JSON.stringify(midToken));
  return tokenSplitted.join('.');
}

/* Setup stage */
let n = 0;
const test = setupTestContext(() => {
  const localStorageMock = createLocalStorageMock();
  const instanceId = `Instance ${n++}`;

  ApiClient.init({
    notificationService: {
      error: (message: NotificationMessage) => {
        /* noop */
      },
    } as INotificationService,
    translationService: {
      t: (message: string) => message,
    } as ITranslationService,
    loginApiPath: '/login',
    refreshTokenApiPath: '/refresh',
    baseURL: 'https://localhost/api',
    timeout: 3000,
    storage: localStorageMock,
    instanceId,
  });

  const apiClient = ApiClient.getInstance(instanceId);
  // trick to get access to private var
  const axiosInstance = (apiClient as any).apiSauceInstance.axiosInstance;
  const username = 'testuser';
  const password = 'testpassword';
  const expiredToken =
    'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJ0cm1rNEFKRjF4Y2llMG5IQ0ZqUGdYbDVISmVkUFRmMXB5cE9rUHZtNXZVIn0.eyJleHAiOjE2NDI2ODAzOTksImlhdCI6MTY0MjY4MDA5OSwianRpIjoiZmNmMzZkOWQtNzkxNS00NTkyLTgxYjktOTE5ZDBlNDc1MTdiIiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo4MDgwL2F1dGgvcmVhbG1zL2tvbnR1ci10ZXN0IiwiYXVkIjoiYWNjb3VudCIsInN1YiI6ImE1MTY4Y2NjLWQ1M2YtNDk1Mi04ZjlhLWNiMzlhYjE2MTRmOCIsInR5cCI6IkJlYXJlciIsImF6cCI6ImtvbnR1ci10ZXN0Iiwic2Vzc2lvbl9zdGF0ZSI6ImUxODdjNzE4LWYxNGUtNGE5Yi1iZGQ3LTM0ZDJhOTBjNzY5YiIsImFjciI6IjEiLCJhbGxvd2VkLW9yaWdpbnMiOlsiKiJdLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsib2ZmbGluZV9hY2Nlc3MiLCJ1bWFfYXV0aG9yaXphdGlvbiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoiZW1haWwgcHJvZmlsZSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJuYW1lIjoiVGVzdFVzZXIgVGVzdFVzZXIyIiwicHJlZmVycmVkX3VzZXJuYW1lIjoidGVzdCIsImdpdmVuX25hbWUiOiJUZXN0VXNlciIsImZhbWlseV9uYW1lIjoiVGVzdFVzZXIyIiwiZW1haWwiOiJ0ZXN0QHRlc3QuY29tIn0.He9jZVuvl_4kfvbNrknqiXxg01CfZojD_KT3yc8dnu3pjDL_vzWDWKCFNX0mlLXEuBLZXCUc8lEMgVO0qWp2MBRn79g7boVDXZLWheQINoGXjJ94Su_c6JHKtenYn9deMkxeJo0CQHB_Ellcu59J3L-Ob68qNnipN4jm4eMzsKvGXMWpzbmGL2kl5vit6JYAU0xWPiY79tOl-EhmSb34-nryvZ5NezMR_a-ZXlfG0hZBDSVJ0Syauu9Vy_QE_Hoey0UFtQfRO9UjpeFsrOy4aR0IcOhQk5PR2AXbwi8qaUQSPdz8XRtEqteCWW8Fj3De6JYzWSELuj-OE3VD0Z0akA';
  const actualToken = setTokenExp(expiredToken, setTimeOffset(10));
  const refreshToken = 'testRefreshToken';

  return {
    localStorageMock,
    apiClient,
    loginFunc: async () => await apiClient.login(username, password),
    token: actualToken,
    expiredToken: expiredToken,
    refreshToken: refreshToken,
    mockAdapter: new MockAdapter(axiosInstance),
    username,
    password,
  };
});

/* Test cases */

test('can login with username and password', async (t) => {
  // Mock backend
  const loginRequestMock = sinon.fake.returns([
    200,
    {
      access_token: t.context.token,
      refresh_token: t.context.refreshToken,
    },
  ]);

  t.context.mockAdapter.onPost('login').reply(loginRequestMock);

  // Mock localStorage setItem
  const setItemFake = sinon.fake();
  sinon.replace(t.context.localStorageMock, 'setItem', setItemFake);

  // Login
  const res: any = await t.context.apiClient.login(
    t.context.username,
    t.context.password,
  );

  // Assertions
  t.is(loginRequestMock.callCount, 1);
  t.is(
    setItemFake.getCall(0).args[1],
    JSON.stringify({
      token: t.context.token,
      refreshToken: t.context.refreshToken,
    }),
    'token saved in storage',
  );
  t.is(res.token, t.context.token, 'response contain new accessToken');
  t.is(
    res.refreshToken,
    t.context.refreshToken,
    'response contain new refreshToken',
  );
});

test('invalid token error', async (t) => {
  // Mock backend
  const loginRequestMock = sinon.fake.returns([
    200,
    {
      access_token: '123',
      refresh_token: t.context.refreshToken,
    },
  ]);

  // Login
  t.context.mockAdapter.onPost('login').reply(loginRequestMock);

  // Assertions
  await t.throwsAsync(t.context.loginFunc, {
    instanceOf: ApiClientError,
    message: "Can't decode token!",
  });
});

test('expired token error', async (t) => {
  // Mock backend
  const loginRequestMock = sinon.fake.returns([
    200,
    {
      access_token: t.context.expiredToken,
      refresh_token: t.context.refreshToken,
    },
  ]);

  // Login
  t.context.mockAdapter.onPost('login').reply(loginRequestMock);

  // Assertions
  await t.throwsAsync(t.context.loginFunc, {
    instanceOf: ApiClientError,
    message: 'Wrong token expire time!',
  });
});

test('204 auth error', async (t) => {
  // Mock backend
  const loginRequestMock = sinon.fake.returns([204]);

  // Login
  t.context.mockAdapter.onPost('login').reply(loginRequestMock);

  // Assertions
  await t.throwsAsync(t.context.loginFunc, {
    instanceOf: ApiClientError,
    message: 'No data received!',
  });
});

test('no auth data error', async (t) => {
  // Mock backend
  const loginRequestMock = sinon.fake.returns([200]);

  // Login
  t.context.mockAdapter.onPost('login').reply(loginRequestMock);

  // Assertions
  await t.throwsAsync(t.context.loginFunc, {
    instanceOf: ApiClientError,
    message: 'Wrong data received!',
  });
});

test('refreshToken called when token is expired', async (t) => {
  t.plan(2);

  // set private field token with new token
  const apiClientObj = t.context.apiClient as any;
  apiClientObj.tokenWillExpire = new Date(new Date().getTime() + 1000 * 60 * 4);
  apiClientObj.token = t.context.token;

  // mock refreshAuthToken
  const refreshFn = sinon.fake();
  sinon.replace(t.context.apiClient, 'refreshAuthToken', refreshFn);

  // Assertions
  await t.throwsAsync(t.context.apiClient.get('/test'), {
    instanceOf: ApiClientError,
  });

  t.is(refreshFn.callCount, 1, 'Refresh api has been called');
});

test('login and refresh token', async (t) => {
  t.plan(7);

  // mock refreshAuthToken
  const refreshFn = sinon.fake();
  sinon.replace(t.context.apiClient, 'refreshAuthToken', refreshFn);

  const expirationTime = setTimeOffset(4);
  const newToken = setTokenExp(t.context.expiredToken, expirationTime);

  // Mock backend
  const loginRequestMock = sinon.fake.returns([
    200,
    {
      access_token: newToken,
      refresh_token: t.context.refreshToken,
    },
  ]);
  t.context.mockAdapter.onPost('login').reply(loginRequestMock);

  // Login
  await t.context.apiClient.login(t.context.username, t.context.password);

  // Assertions
  const params = new URLSearchParams(loginRequestMock.getCall(0).args[0].data);
  t.is(params.get('username'), t.context.username, 'Login with username');

  t.is(params.get('password'), t.context.password, 'Login with password');

  t.deepEqual(
    // @ts-expect-error - Fix me - check expire time without reading private fields
    t.context.apiClient.tokenWillExpire,
    new Date(expirationTime * 1000),
  );
  // @ts-expect-error - Fix me - check expire time without reading private fields
  t.is(t.context.apiClient.token, newToken);
  // @ts-expect-error - Fix me - check expire time without reading private fields
  t.is(t.context.apiClient.refreshToken, t.context.refreshToken);

  await t.throwsAsync(t.context.apiClient.get('/test'), {
    instanceOf: ApiClientError,
  });

  t.is(refreshFn.callCount, 1, 'Refresh api has been called');
});

test('Calls api with authorization', async (t) => {
  // Mock backend
  const loginRequestMock = sinon.fake.returns([
    200,
    {
      access_token: t.context.token,
      refresh_token: t.context.refreshToken,
    },
  ]);
  t.context.mockAdapter.onPost('login').reply(loginRequestMock);

  const apiWithAuthorizationMock = sinon.fake.returns([200]);
  t.context.mockAdapter.onGet('test').reply(apiWithAuthorizationMock);

  // Api calls
  await t.context.apiClient.login(t.context.username, t.context.password);
  await t.context.apiClient.get('/test');

  // Assertions
  t.is(
    apiWithAuthorizationMock.getCall(0).args[0].headers.Authorization,
    `Bearer ${t.context.token}`,
    'Api with authorization have Authorization header',
  );
});

test('Calls api without authorization', async (t) => {
  // Mock backend
  const apiWithoutAuthorizationMock = sinon.fake.returns([200]);
  t.context.mockAdapter.onPost('test').reply(apiWithoutAuthorizationMock);

  // Api calls
  await t.context.apiClient.post('/test', { param1: 'test' }, false);

  // Assertions
  t.not(
    apiWithoutAuthorizationMock.getCall(0).args[0].headers.Authorization,
    `Bearer ${t.context.token}`,
    'Api without authorization have Authorization header',
  );
});

test('Not add authorization header to api without authorization', async (t) => {
  // Mock backend
  const loginRequestMock = sinon.fake.returns([
    200,
    {
      access_token: t.context.token,
      refresh_token: t.context.refreshToken,
    },
  ]);
  t.context.mockAdapter.onPost('login').reply(loginRequestMock);

  const apiWithoutAuthorizationMock = sinon.fake.returns([200]);
  t.context.mockAdapter.onPost('test').reply(apiWithoutAuthorizationMock);

  // Api calls
  await t.context.apiClient.login(t.context.username, t.context.password);
  await t.context.apiClient.post('/test', { param1: 'test' }, false);

  // Assertions
  t.is(
    apiWithoutAuthorizationMock.getCall(0).args[0].headers.Authorization,
    undefined,
    'Api without authorization not have authorization header',
  );
});
