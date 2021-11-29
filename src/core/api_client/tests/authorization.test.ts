import MockAdapter from 'axios-mock-adapter';
import sinon from 'sinon';
import type { NotificationMessage } from '../../../core/types/notification';
import type { AuthResponseData } from '../../../core/api_client/ApiTypes';
import {
  setupTestContext,
  createLocalStorageMock,
} from '../../../utils/testsUtils/setupTest';
import { ApiClientError } from '../ApiProblem';
import { base64UrlDecode, base64UrlEncode } from './_tokenUtils';
import {
  ApiClient,
  INotificationService,
  ITranslationService,
} from '../ApiClient';

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

  return {
    localStorageMock,
    apiClient,
    loginFunc: async () => await apiClient.login(username, password),
    token:
      'eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiYWRtaW4iLCJVc2VybmFtZSI6InRlc3R1c2VyIiwiZXhwIjoxNjk3MTA2NDM0LCJpYXQiOjE2MzQwMzQ0MzR9.0GUrGfXYioalJVDRfWgWfx3oQRwk9FsOeAvULj-3ins',
    expiredToken:
      'eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiYWRtaW4iLCJVc2VybmFtZSI6InRlc3R1c2VyIiwiZXhwIjoxNjAyNDk4NDM0LCJpYXQiOjE2MzQwMzQ0MzR9.tIETTaRaiJYto0Wb4oPbfCJHUGGjw9--mTfXVWWsVMk',
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
      accessToken: t.context.token,
      refreshToken: t.context.token,
    },
  ]);

  t.context.mockAdapter.onPost('login').reply(loginRequestMock);

  // Mock localStorage setItem
  const setItemFake = sinon.fake();
  sinon.replace(t.context.localStorageMock, 'setItem', setItemFake);

  // Login
  const res = (await t.context.apiClient.login(
    t.context.username,
    t.context.password,
  )) as AuthResponseData;

  // Assertions
  t.is(loginRequestMock.callCount, 1);
  t.is(
    setItemFake.getCall(0).args[1],
    JSON.stringify({ token: t.context.token, refreshToken: t.context.token }),
    'token saved in storage',
  );
  t.is(res.accessToken, t.context.token, 'response contain new accessToken');
  t.is(res.refreshToken, t.context.token, 'response contain new refreshToken');
});

test('invalid token error', async (t) => {
  // Mock backend
  const loginRequestMock = sinon.fake.returns([
    200,
    { accessToken: '123', refreshToken: '123' },
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
      accessToken: t.context.expiredToken,
      refreshToken: t.context.expiredToken,
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
  // apiClientObj.token = newToken;

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
  t.plan(6);

  const expirationTime = (new Date().getTime() + 1000 * 60 * 4) / 1000;

  // modify expired token to set expiration time in less than 5min (in 4min)
  const tokenSplitted = t.context.token.split('.');
  const midToken = JSON.parse(base64UrlDecode(tokenSplitted[1]));
  midToken.exp = expirationTime;
  tokenSplitted[1] = base64UrlEncode(JSON.stringify(midToken));
  const newToken = tokenSplitted.join('.');
  const refreshToken = 'testrefresh';

  // mock refreshAuthToken
  const refreshFn = sinon.fake();
  sinon.replace(t.context.apiClient, 'refreshAuthToken', refreshFn);

  // Mock backend
  const loginRequestMock = sinon.fake.returns([
    200,
    {
      accessToken: newToken,
      refreshToken,
    },
  ]);
  t.context.mockAdapter.onPost('login').reply(loginRequestMock);

  // Login
  await t.context.apiClient.login(t.context.username, t.context.password);

  // Assertions
  t.deepEqual(
    JSON.parse(loginRequestMock.getCall(0).args[0].data),
    {
      username: t.context.username,
      password: t.context.password,
    },
    'Login with username and password',
  );

  t.deepEqual(
    // @ts-expect-error - Fix me - check expire time without reading private fields
    t.context.apiClient.tokenWillExpire,
    new Date(expirationTime * 1000),
  );
  // @ts-expect-error - Fix me - check expire time without reading private fields
  t.is(t.context.apiClient.token, newToken);
  // @ts-expect-error - Fix me - check expire time without reading private fields
  t.is(t.context.apiClient.refreshToken, refreshToken);

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
      accessToken: t.context.token,
      refreshToken: 'testrefresh',
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
      accessToken: t.context.token,
      refreshToken: 'testrefresh',
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
