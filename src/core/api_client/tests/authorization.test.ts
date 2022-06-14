/**
 * @vitest-environment happy-dom
 */
import { test, expect, beforeEach } from 'vitest';
import sinon from 'sinon';
import './_configMock';
import { ApiClientError } from '../apiClientError';
import {
  createContext,
  setTimeOffset,
  setTokenExp,
} from './_clientTestsContext';

beforeEach((context) => {
  context.ctx = createContext();
});

test('can login with username and password', async ({ ctx }) => {
  // Mock backend
  const loginRequestMock = sinon.fake.returns([
    200,
    {
      access_token: ctx.token,
      refresh_token: ctx.refreshToken,
    },
  ]);

  ctx.mockAdapter.onPost('login').reply(loginRequestMock);

  // Mock localStorage setItem
  const setItemFake = sinon.fake();
  sinon.replace(ctx.localStorageMock, 'setItem', setItemFake);

  // Login
  const res: any = await ctx.apiClient.login(ctx.username, ctx.password);

  // Assertions
  expect(loginRequestMock.callCount).toBe(1);
  expect(setItemFake.getCall(0).args[1], 'token saved in storage').toBe(
    JSON.stringify({
      token: ctx.token,
      refreshToken: ctx.refreshToken,
    }),
  );

  expect(res.token, 'response contain new accessToken').toBe(ctx.token);
  expect(res.refreshToken, 'response contain new refreshToken').toBe(
    ctx.refreshToken,
  );
});

/**
 * await expect().rejects.toMatchObject();
 */

test('invalid token error', async ({ ctx }) => {
  // Mock backend
  const loginRequestMock = sinon.fake.returns([
    200,
    {
      access_token: '123',
      refresh_token: ctx.refreshToken,
    },
  ]);

  // Login
  ctx.mockAdapter.onPost('login').reply(loginRequestMock);

  // Assertions
  try {
    await ctx.loginFunc();
  } catch (e) {
    expect(e).toMatchObject(
      new ApiClientError("Can't decode token!", {
        kind: 'bad-data',
      }),
    );
    expect(e.problem).toMatchObject({
      kind: 'bad-data',
    });
  }
});

test('expired token error', async ({ ctx }) => {
  // Mock backend
  const loginRequestMock = sinon.fake.returns([
    200,
    {
      access_token: ctx.expiredToken,
      refresh_token: ctx.refreshToken,
    },
  ]);

  // Login
  ctx.mockAdapter.onPost('login').reply(loginRequestMock);

  // Assertions

  try {
    await ctx.loginFunc();
  } catch (e) {
    expect(e).toMatchObject(
      new ApiClientError('Wrong token expire time!', {
        kind: 'bad-data',
      }),
    );
    expect(e.problem).toMatchObject({
      kind: 'bad-data',
    });
  }
});

test('204 auth error', async ({ ctx }) => {
  // Mock backend
  const loginRequestMock = sinon.fake.returns([204]);

  // Login
  ctx.mockAdapter.onPost('login').reply(loginRequestMock);

  // Assertions
  try {
    await ctx.loginFunc();
  } catch (e) {
    expect(e).toMatchObject(
      new ApiClientError('No data received!', {
        kind: 'unauthorized',
        data: 'Wrong token expire time!',
      }),
    );
    expect(e.problem).toMatchObject({
      kind: 'no-data',
    });
  }
});

test('no auth data error', async ({ ctx }) => {
  // Mock backend
  const loginRequestMock = sinon.fake.returns([200]);

  // Login
  ctx.mockAdapter.onPost('login').reply(loginRequestMock);

  // Assertions
  try {
    await ctx.loginFunc();
  } catch (e) {
    expect(e).toMatchObject(
      new ApiClientError('Wrong data received!', {
        kind: 'bad-data',
      }),
    );
    expect(e.problem).toMatchObject({
      kind: 'bad-data',
    });
  }
});

test('refreshToken called when token is expired', async ({ ctx }) => {
  expect.assertions(3);

  // set private field token with new token
  const apiClientObj = ctx.apiClient as any;
  apiClientObj.tokenWillExpire = new Date(new Date().getTime() + 1000 * 60 * 4);
  apiClientObj.token = ctx.token;

  // mock refreshAuthToken
  const refreshFn = sinon.fake();
  sinon.replace(ctx.apiClient, 'refreshAuthToken', refreshFn);

  // Assertions
  try {
    await ctx.apiClient.get('/test');
  } catch (e) {
    expect(e).toMatchObject(
      new ApiClientError('Not authorized or session has expired.', {
        kind: 'bad-data',
      }),
    );
    expect(e.problem).toMatchObject({
      kind: 'unauthorized',
      data: 'Not authorized or session has expired.',
    });
  }

  expect(refreshFn.callCount, 'Refresh api has been called').toBe(1);
});

test('login and refresh token', async ({ ctx }) => {
  expect.assertions(7);

  // mock refreshAuthToken
  const refreshFn = sinon.fake();
  sinon.replace(ctx.apiClient, 'refreshAuthToken', refreshFn);

  const expirationTime = setTimeOffset(4);
  const newToken = setTokenExp(ctx.expiredToken, expirationTime);

  // Mock backend
  const loginRequestMock = sinon.fake.returns([
    200,
    {
      access_token: newToken,
      refresh_token: ctx.refreshToken,
    },
  ]);
  ctx.mockAdapter.onPost('login').reply(loginRequestMock);

  // Login
  await ctx.apiClient.login(ctx.username, ctx.password);

  // Assertions
  const params = new URLSearchParams(loginRequestMock.getCall(0).args[0].data);
  expect(params.get('username'), 'Login with username').toBe(ctx.username);
  expect(params.get('password'), 'Login with password').toBe(ctx.password);

  expect(
    // @ts-expect-error - Fix me - check expire time without reading private fields
    ctx.apiClient.tokenWillExpire,
  ).toStrictEqual(new Date(expirationTime * 1000));
  // @ts-expect-error - Fix me - check expire time without reading private fields
  expect(ctx.apiClient.token).toBe(newToken);
  // @ts-expect-error - Fix me - check expire time without reading private fields
  expect(ctx.apiClient.refreshToken).toBe(ctx.refreshToken);
  expect(ctx.apiClient.get('/test')).rejects.toThrowError();
  expect(refreshFn.callCount, 'Refresh api has been called').toBe(1);
});

test('Calls api with authorization', async ({ ctx }) => {
  // Mock backend
  const loginRequestMock = sinon.fake.returns([
    200,
    {
      access_token: ctx.token,
      refresh_token: ctx.refreshToken,
    },
  ]);
  ctx.mockAdapter.onPost('login').reply(loginRequestMock);

  const apiWithAuthorizationMock = sinon.fake.returns([200]);
  ctx.mockAdapter.onGet('test').reply(apiWithAuthorizationMock);

  // Api calls
  await ctx.apiClient.login(ctx.username, ctx.password);
  await ctx.apiClient.get('/test');

  // Assertions
  expect(
    apiWithAuthorizationMock.getCall(0).args[0].headers.Authorization,
    'Api with authorization have Authorization header',
  ).toBe(`Bearer ${ctx.token}`);
});

test('Calls api without authorization', async ({ ctx }) => {
  // Mock backend
  const apiWithoutAuthorizationMock = sinon.fake.returns([200]);
  ctx.mockAdapter.onPost('test').reply(apiWithoutAuthorizationMock);

  // Api calls
  await ctx.apiClient.post('/test', { param1: 'test' }, false);

  // Assertions
  expect(
    apiWithoutAuthorizationMock.getCall(0).args[0].headers.Authorization,
    'Api without authorization have Authorization header',
  ).not.toBe(`Bearer ${ctx.token}`);
});

test('Not add authorization header to api without authorization', async ({
  ctx,
}) => {
  // Mock backend
  const loginRequestMock = sinon.fake.returns([
    200,
    {
      access_token: ctx.token,
      refresh_token: ctx.refreshToken,
    },
  ]);
  ctx.mockAdapter.onPost('login').reply(loginRequestMock);

  const apiWithoutAuthorizationMock = sinon.fake.returns([200]);
  ctx.mockAdapter.onPost('test').reply(apiWithoutAuthorizationMock);

  // Api calls
  await ctx.apiClient.login(ctx.username, ctx.password);
  await ctx.apiClient.post('/test', { param1: 'test' }, false);

  // Assertions
  expect(
    apiWithoutAuthorizationMock.getCall(0).args[0].headers.Authorization,
    'Api without authorization not have authorization header',
  ).toBeUndefined();
});
