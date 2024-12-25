/**
 * @vitest-environment happy-dom
 */
import { beforeEach, expect, test, vi } from 'vitest';
import { ApiClientError } from '../apiClientError';
import { createContext } from './_clientTestsContext';

declare module 'vitest' {
  interface TestContext {
    ctx: ReturnType<typeof createContext>;
  }
}

// Utility functions
function isApiError(error: unknown): error is ApiClientError {
  return error instanceof ApiClientError;
}

function getApiErrorKind(error: unknown): string | undefined {
  return isApiError(error) ? error.problem.kind : undefined;
}

function getApiErrorMessage(error: unknown): string | undefined {
  return isApiError(error) ? error.message : undefined;
}

function setTimeOffset(minutes: number): number {
  return Math.floor(Date.now() / 1000) + minutes * 60;
}

beforeEach((context) => {
  context.ctx = createContext();
});

test('can login with username and password', async ({ ctx }) => {
  // Mock localStorage setItem using Vitest
  const setItemFake = vi.fn();
  vi.spyOn(ctx.localStorageMock, 'setItem').mockImplementation(setItemFake);

  // Login
  const res: any = await ctx.authClient.login(ctx.username, ctx.password);

  // Assertions using Vitest's mock matchers
  expect(setItemFake).toHaveBeenCalledWith(
    expect.any(String),
    JSON.stringify({
      token: ctx.token,
      refreshToken: ctx.refreshToken,
    }),
  );
});

test('invalid token error', async ({ ctx }) => {
  // Assertions
  try {
    await ctx.authClient.login('wrong-user', 'wrong-password');
  } catch (e) {
    expect(e).toBeInstanceOf(ApiClientError);
    expect((e as ApiClientError).problem.kind).toBe('unauthorized');
    expect((e as ApiClientError).message).toBe('Invalid username or password');
  }
});

test('expired token error', async ({ ctx }) => {
  const tokenEndpoint = `${ctx.baseUrl}/realms/${ctx.keycloakRealm}/protocol/openid-connect/token`;
  ctx.fetchMock.once(tokenEndpoint, {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
    body: {
      access_token: ctx.expiredToken,
      refresh_token: ctx.refreshToken,
    },
  });

  try {
    await ctx.loginFunc();
  } catch (e) {
    expect(e).toBeInstanceOf(ApiClientError);
    expect((e as ApiClientError).problem.kind).toBe('bad-data');
    expect((e as ApiClientError).message).toBe(
      'Token is expired right after receiving, clock is out of sync',
    );
  }
});

test('204 auth error', async ({ ctx }) => {
  const tokenEndpoint = `${ctx.baseUrl}/realms/${ctx.keycloakRealm}/protocol/openid-connect/token`;
  ctx.fetchMock.once(tokenEndpoint, {
    status: 204,
  });

  // Assertions
  try {
    await ctx.loginFunc();
  } catch (e) {
    expect(e).toBeInstanceOf(ApiClientError);
    expect((e as ApiClientError).problem.kind).toBe('client-unknown');
  }
});

test('no auth data error', async ({ ctx }) => {
  const tokenEndpoint = `${ctx.baseUrl}/realms/${ctx.keycloakRealm}/protocol/openid-connect/token`;
  ctx.fetchMock.once(tokenEndpoint, {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
    body: {},
  });

  // Assertions
  try {
    await ctx.loginFunc();
  } catch (e) {
    expect(e).toBeInstanceOf(ApiClientError);
    expect((e as ApiClientError).problem.kind).toBe('bad-data');
  }
});

test('Not add authorization header to api without authorization', async ({ ctx }) => {
  // Api calls
  await ctx.authClient.login(ctx.username, ctx.password);
  await ctx.apiClient.post('/test', { param1: 'test' }, false);

  // Assertions
  const lastCall = ctx.fetchMock.callHistory.lastCall();
  expect(lastCall?.options?.headers?.['Authorization']).toBeUndefined();
});

test('refreshToken called when token is expired', async ({ ctx }) => {
  expect.assertions(2);

  // set private field token with new token
  const apiClientObj = ctx.apiClient as any;
  // token expires in 4 minutes
  apiClientObj.tokenExpirationDate = new Date(new Date().getTime() + 1000 * 60 * 4);
  apiClientObj.token = ctx.token;

  // Replace sinon.fake() and sinon.replace() with vi.fn() and vi.spyOn()
  const refreshFn = vi.fn();
  vi.spyOn(ctx.apiClient.authService, 'getAccessToken').mockImplementation(refreshFn);

  // Assertions
  try {
    await ctx.apiClient.get('/test');
  } catch (e) {
    expect(isApiError(e)).toBe(true);
    expect(getApiErrorKind(e)).toBe('client-unknown');
  }
});

test('login and refresh token', async ({ ctx }) => {
  expect.assertions(2);

  const refreshFn = vi.fn();
  vi.spyOn(ctx.apiClient.authService, 'getAccessToken').mockImplementation(refreshFn);

  const expirationTime = setTimeOffset(4);
  const newToken = ctx.token;

  // Mock backend using fetchMock
  ctx.fetchMock.post(`${ctx.baseUrl}/test`, {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
    body: {
      access_token: newToken,
      refresh_token: ctx.refreshToken,
    },
  });

  // API call
  await ctx.apiClient.post('/test', { param1: 'test' }, true);

  // Assertions
  expect(ctx.apiClient.get('/test')).rejects.toThrowError();
  expect(refreshFn).toHaveBeenCalledTimes(1);
});

test('Calls api with authorization', async ({ ctx }) => {
  // Mock backend using fetchMock
  ctx.fetchMock.post(`${ctx.baseUrl}/test`, {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
    body: { data: 'test' },
  });

  // Api calls
  await ctx.authClient.login(ctx.username, ctx.password);
  await ctx.apiClient.post('/test', { param1: 'test' }, true);

  // Get the last call from fetchMock
  const lastCall = ctx.fetchMock.callHistory.lastCall();
  const lastCallOptions = lastCall?.options as RequestInit;
  const authHeader =
    lastCallOptions?.headers?.['Authorization'] ||
    lastCallOptions?.headers?.['authorization'];
  expect(authHeader).toBe(`Bearer ${ctx.token}`);
});

test('Calls api without authorization', async ({ ctx }) => {
  // Mock backend using fetchMock
  ctx.fetchMock.post(`${ctx.baseUrl}/test`, {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
    body: { data: 'test' },
  });

  // Api calls
  await ctx.apiClient.post('/test', { param1: 'test' }, false);

  // Get the last call from fetchMock
  const lastCall = ctx.fetchMock.callHistory.lastCall();
  const lastCallOptions = lastCall?.options as RequestInit;
  expect(lastCallOptions?.headers?.['Authorization']).toBeUndefined();
});
