/**
 * @vitest-environment happy-dom
 */
import { beforeEach, expect, test, describe } from 'vitest';
import { AUTH_REQUIREMENT } from '~core/auth/constants';
import { createContext } from './_clientTestsContext';

declare module 'vitest' {
  interface TestContext {
    ctx: Awaited<ReturnType<typeof createContext>>;
  }
}

beforeEach(async (context) => {
  context.ctx = await createContext();
});

describe('API Request Headers', () => {
  test('should use auth header when OPTIONAL and logged in', async ({ ctx }) => {
    await ctx.authClient.login(ctx.username, ctx.password);
    await ctx.apiClient.post(
      '/test',
      { param1: 'test' },
      {
        authRequirement: AUTH_REQUIREMENT.OPTIONAL,
      },
    );

    const lastCall = ctx.fetchMock.callHistory.lastCall();
    const lastCallOptions = lastCall?.options as RequestInit;
    const authHeader =
      lastCallOptions?.headers?.['Authorization'] ||
      lastCallOptions?.headers?.['authorization'];
    expect(authHeader).toBe(`Bearer ${ctx.token}`);
  });

  test('should require auth header when AUTH_REQUIREMENT.MUST', async ({ ctx }) => {
    ctx.fetchMock.post(`${ctx.baseUrl}/test`, {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      body: { data: 'test' },
    });

    await ctx.authClient.login(ctx.username, ctx.password);
    await ctx.apiClient.post(
      '/test',
      { param1: 'test' },
      {
        authRequirement: AUTH_REQUIREMENT.MUST,
      },
    );

    const lastCall = ctx.fetchMock.callHistory.lastCall();
    const lastCallOptions = lastCall?.options as RequestInit;
    const authHeader =
      lastCallOptions?.headers?.['Authorization'] ||
      lastCallOptions?.headers?.['authorization'];
    expect(authHeader).toBe(`Bearer ${ctx.token}`);
  });

  test('should throw error when auth fails with AUTH_REQUIREMENT.MUST and endpoint should not be called', async ({
    ctx,
  }) => {
    // Do not log in, so auth should fail
    await expect(
      ctx.apiClient.post(
        '/test',
        { param1: 'test' },
        {
          authRequirement: AUTH_REQUIREMENT.MUST,
        },
      ),
    ).rejects.toThrowError('Authentication required'); // Check for correct error message

    const lastCall = ctx.fetchMock.callHistory.lastCall();
    // Expect that the target API endpoint was not called
    expect(lastCall).toBeUndefined();
  });

  test('should attempt auth when OPTIONAL and logged in', async ({ ctx }) => {
    ctx.fetchMock.post(`${ctx.baseUrl}/test`, {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      body: { data: 'test' },
    });

    await ctx.authClient.login(ctx.username, ctx.password);
    await ctx.apiClient.post(
      '/test',
      { param1: 'test' },
      {
        authRequirement: AUTH_REQUIREMENT.OPTIONAL,
      },
    );

    const lastCall = ctx.fetchMock.callHistory.lastCall();
    const lastCallOptions = lastCall?.options as RequestInit;
    const authHeader =
      lastCallOptions?.headers?.['Authorization'] ||
      lastCallOptions?.headers?.['authorization'];
    expect(authHeader).toBe(`Bearer ${ctx.token}`);
  });

  test('should skip auth when OPTIONAL and not logged in', async ({ ctx }) => {
    ctx.fetchMock.post(`${ctx.baseUrl}/test`, {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      body: { data: 'test' },
    });

    await ctx.apiClient.post(
      '/test',
      { param1: 'test' },
      {
        authRequirement: AUTH_REQUIREMENT.OPTIONAL,
      },
    );

    const lastCall = ctx.fetchMock.callHistory.lastCall();
    const lastCallOptions = lastCall?.options as RequestInit;
    expect(lastCallOptions?.headers?.['Authorization']).toBeUndefined();
  });

  test('should not add auth header when AUTH_REQUIREMENT.NEVER', async ({ ctx }) => {
    ctx.fetchMock.post(`${ctx.baseUrl}/test`, {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      body: { data: 'test' },
    });

    // Even if logged in, NEVER should not add auth header
    await ctx.authClient.login(ctx.username, ctx.password);
    await ctx.apiClient.post(
      '/test',
      { param1: 'test' },
      {
        authRequirement: AUTH_REQUIREMENT.NEVER,
      },
    );

    const lastCall = ctx.fetchMock.callHistory.lastCall();
    const lastCallOptions = lastCall?.options as RequestInit;
    expect(lastCallOptions?.headers?.['Authorization']).toBeUndefined();
  });
});
