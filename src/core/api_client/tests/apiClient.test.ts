/**
 * @vitest-environment happy-dom
 */
import { beforeEach, expect, test, describe } from 'vitest';
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
