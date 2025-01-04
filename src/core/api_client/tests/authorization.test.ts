/**
 * @vitest-environment happy-dom
 */
import { beforeEach, expect, test, describe, vi } from 'vitest';
import fetchMock from '@fetch-mock/vitest';
import { ApiClientError, getApiErrorKind } from '../apiClientError';
import { createContext } from './_clientTestsContext';
import { TokenFactory } from './factories/token.factory';
import { MockFactory } from './factories/mock.factory';
import { AuthFactory } from './factories/auth.factory';

declare module 'vitest' {
  interface TestContext {
    ctx: Awaited<ReturnType<typeof createContext>>;
  }
}

beforeEach(async (context) => {
  context.ctx = await createContext();
});

describe('API Client Authentication', () => {
  test('should handle password grant authentication', async ({ ctx }) => {
    // Reset mocks to ensure clean state
    MockFactory.resetMocks();

    const validToken = await TokenFactory.createToken({
      sub: '1234567890',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600,
    });

    const tokenEndpoint = AuthFactory.getTokenEndpoint(ctx);
    await MockFactory.setupSuccessfulAuth(
      { baseUrl: ctx.baseUrl, realm: ctx.keycloakRealm },
      validToken,
    );

    // Set up the logout endpoint
    MockFactory.setupLogoutEndpoint({
      baseUrl: ctx.baseUrl,
      realm: ctx.keycloakRealm,
    });

    await ctx.authClient.authenticate('test-user', 'test-password');
    expect(ctx.authClient.isUserLoggedIn).toBe(true);

    const storedToken = await ctx.authClient.getAccessToken();
    expect(storedToken).toBe(validToken);

    // Verify token request format
    const lastCall = ctx.fetchMock.callHistory.lastCall();
    const lastCallOptions = lastCall?.options as RequestInit;
    expect(lastCall?.url).toBe(tokenEndpoint);
    expect(lastCallOptions?.body?.toString()).toContain('grant_type=password');
    expect(lastCallOptions?.body?.toString()).toContain('username=test-user');
    expect(lastCallOptions?.body?.toString()).toContain('password=test-password');
  });

  test('should handle authentication failures', async ({ ctx }) => {
    // Reset mocks to ensure clean state
    MockFactory.resetMocks();

    const tokenEndpoint = AuthFactory.getTokenEndpoint(ctx);
    const config = { baseUrl: ctx.baseUrl, realm: ctx.keycloakRealm };

    // Set up the logout endpoint
    MockFactory.setupLogoutEndpoint(config);

    // Test various error scenarios
    const errorCases = [
      {
        setup: () =>
          fetchMock.post(tokenEndpoint, {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
            body: {
              error: 'invalid_grant',
              error_description: 'Invalid username or password',
            },
          }),
        expectedKind: 'unauthorized',
      },
      {
        setup: () =>
          fetchMock.post(tokenEndpoint, {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
            body: {
              error: 'invalid_request',
              error_description: 'Invalid request parameters',
            },
          }),
        expectedKind: 'bad-request',
      },
      {
        setup: () =>
          fetchMock.post(tokenEndpoint, {
            throws: new Error('Network error'),
          }),
        expectedKind: 'client-unknown',
      },
    ];

    for (const errorCase of errorCases) {
      MockFactory.resetMocks();
      errorCase.setup();
      MockFactory.setupLogoutEndpoint(config); // Re-setup logout endpoint after reset

      try {
        await ctx.authClient.login('test-user', 'test-password');
        throw new Error('Should have failed authentication');
      } catch (e) {
        expect(e).toBeInstanceOf(ApiClientError);
        expect(getApiErrorKind(e)).toBe(errorCase.expectedKind);
      }
    }
  });
});
