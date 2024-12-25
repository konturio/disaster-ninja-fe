/**
 * @vitest-environment happy-dom
 */
import { beforeEach, expect, test, describe, vi } from 'vitest';
import { ApiClientError } from '../apiClientError';
import { createContext } from './_clientTestsContext';

declare module 'vitest' {
  interface TestContext {
    ctx: Awaited<ReturnType<typeof createContext>>;
  }
}

// Utility functions for error handling and testing
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

beforeEach(async (context) => {
  context.ctx = await createContext();
});

describe('Authentication Flow', () => {
  test('should successfully login with valid username and password and store tokens', async ({
    ctx,
  }) => {
    const setItemFake = vi.fn();
    vi.spyOn(ctx.localStorageMock, 'setItem').mockImplementation(setItemFake);

    const res: any = await ctx.authClient.login(ctx.username, ctx.password);

    expect(setItemFake).toHaveBeenCalledWith(
      expect.any(String),
      JSON.stringify({
        token: ctx.token,
        refreshToken: ctx.refreshToken,
      }),
    );
  });

  test('should reject login with invalid credentials', async ({ ctx }) => {
    try {
      await ctx.authClient.login('wrong-user', 'wrong-password');
    } catch (e) {
      expect(e).toBeInstanceOf(ApiClientError);
      expect((e as ApiClientError).problem.kind).toBe('unauthorized');
      expect((e as ApiClientError).message).toBe('Invalid username or password');
    }
  });

  test('should handle expired token immediately after receiving', async ({ ctx }) => {
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
});

describe('Token Management', () => {
  test('should handle empty response from auth server (204)', async ({ ctx }) => {
    const tokenEndpoint = `${ctx.baseUrl}/realms/${ctx.keycloakRealm}/protocol/openid-connect/token`;
    ctx.fetchMock.once(tokenEndpoint, {
      status: 204,
    });

    try {
      await ctx.loginFunc();
    } catch (e) {
      expect(e).toBeInstanceOf(ApiClientError);
      expect((e as ApiClientError).problem.kind).toBe('client-unknown');
    }
  });

  test('should handle missing auth data in response', async ({ ctx }) => {
    const tokenEndpoint = `${ctx.baseUrl}/realms/${ctx.keycloakRealm}/protocol/openid-connect/token`;
    ctx.fetchMock.once(tokenEndpoint, {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      body: {},
    });

    try {
      await ctx.loginFunc();
    } catch (e) {
      expect(e).toBeInstanceOf(ApiClientError);
      expect((e as ApiClientError).problem.kind).toBe('bad-data');
    }
  });

  test('should automatically refresh token when near expiration', async ({ ctx }) => {
    expect.assertions(2);

    const apiClientObj = ctx.apiClient as any;
    apiClientObj.tokenExpirationDate = new Date(new Date().getTime() + 1000 * 60 * 4);
    apiClientObj.token = ctx.token;

    const refreshFn = vi.fn();
    vi.spyOn(ctx.apiClient.authService, 'getAccessToken').mockImplementation(refreshFn);

    try {
      await ctx.apiClient.get('/test');
    } catch (e) {
      expect(isApiError(e)).toBe(true);
      expect(getApiErrorKind(e)).toBe('client-unknown');
    }
  });
});

describe('API Authorization Headers', () => {
  test('should not add authorization header when auth is not required', async ({
    ctx,
  }) => {
    await ctx.authClient.login(ctx.username, ctx.password);
    await ctx.apiClient.post('/test', { param1: 'test' }, false);

    const lastCall = ctx.fetchMock.callHistory.lastCall();
    expect(lastCall?.options?.headers?.['Authorization']).toBeUndefined();
  });

  test('should include valid bearer token in authorized requests', async ({ ctx }) => {
    ctx.fetchMock.post(`${ctx.baseUrl}/test`, {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      body: { data: 'test' },
    });

    await ctx.authClient.login(ctx.username, ctx.password);
    await ctx.apiClient.post('/test', { param1: 'test' }, true);

    const lastCall = ctx.fetchMock.callHistory.lastCall();
    const lastCallOptions = lastCall?.options as RequestInit;
    const authHeader =
      lastCallOptions?.headers?.['Authorization'] ||
      lastCallOptions?.headers?.['authorization'];
    expect(authHeader).toBe(`Bearer ${ctx.token}`);
  });

  test('should make successful request without auth header when not required', async ({
    ctx,
  }) => {
    ctx.fetchMock.post(`${ctx.baseUrl}/test`, {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      body: { data: 'test' },
    });

    await ctx.apiClient.post('/test', { param1: 'test' }, false);

    const lastCall = ctx.fetchMock.callHistory.lastCall();
    const lastCallOptions = lastCall?.options as RequestInit;
    expect(lastCallOptions?.headers?.['Authorization']).toBeUndefined();
  });
});
