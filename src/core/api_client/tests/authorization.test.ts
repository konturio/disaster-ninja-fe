/**
 * @vitest-environment happy-dom
 */
import sinon from 'sinon';
import { beforeEach, expect, test } from 'vitest';
import { ApiClientError } from '../apiClientError';
import { createContext } from './_clientTestsContext';

declare module 'vitest' {
  interface TestContext {
    ctx: ReturnType<typeof createContext>;
  }
}

beforeEach((context) => {
  context.ctx = createContext();
});

test('can login with username and password', async ({ ctx }) => {
  // Mock localStorage setItem
  const setItemFake = sinon.fake();
  sinon.replace(ctx.localStorageMock, 'setItem', setItemFake);

  // Login
  const res: any = await ctx.authClient.login(ctx.username, ctx.password);

  // Assertions
  expect(setItemFake.getCall(0).args[1], 'token saved in storage').toBe(
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
