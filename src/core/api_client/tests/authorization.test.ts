/**
 * @vitest-environment happy-dom
 */
import { beforeEach, expect, test, describe, vi } from 'vitest';
import { ApiClientError } from '../apiClientError';
import { parseToken } from '../../../core/auth/OidcSimpleClient';
import { createContext } from './_clientTestsContext';
import { TokenFactory } from './factories/token.factory';

declare module 'vitest' {
  interface TestContext {
    ctx: Awaited<ReturnType<typeof createContext>>;
  }
}

function isApiError(error: unknown): error is ApiClientError {
  return error instanceof ApiClientError;
}

function getApiErrorKind(error: unknown): string | undefined {
  return isApiError(error) ? error.problem.kind : undefined;
}

function getApiErrorMessage(error: unknown): string | undefined {
  return isApiError(error) ? error.message : undefined;
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

    // Create valid JWT tokens for testing
    const testToken = await TokenFactory.createToken({
      sub: '1234567890',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600,
    });

    // Mock login endpoint
    const tokenEndpoint = `${ctx.baseUrl}/realms/${ctx.keycloakRealm}/protocol/openid-connect/token`;
    ctx.fetchMock.once(tokenEndpoint, {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      body: {
        access_token: testToken,
        refresh_token: testToken,
        expires_in: 300,
      },
    });

    await ctx.authClient.login(ctx.username, ctx.password);

    // Verify token storage format
    expect(setItemFake).toHaveBeenCalledWith(
      'auth_token',
      expect.stringMatching(/"token":"[^"]+","refreshToken":"[^"]+","expiresAt":"[^"]+"/),
    );
  });

  test('should reject login with invalid credentials', async ({ ctx }) => {
    try {
      await ctx.authClient.login('wrong-user', 'wrong-password');
    } catch (e) {
      expect(e).toBeInstanceOf(ApiClientError);
      expect(getApiErrorKind(e)).toBe('unauthorized');
      expect(getApiErrorMessage(e)).toBe('Invalid username or password');
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
      expect(getApiErrorKind(e)).toBe('bad-data');
      expect(getApiErrorMessage(e)).toBe(
        'Token is expired right after receiving, clock is out of sync',
      );
    }
  });
});

describe('Token Storage', () => {
  test('should store and restore tokens across sessions', async ({ ctx }) => {
    const setItemFake = vi.fn();
    const getItemFake = vi.fn();
    const storage = ctx.localStorageMock;

    // Setup storage mocks
    vi.spyOn(storage, 'setItem').mockImplementation((key, value) => {
      setItemFake(key, value);
      getItemFake.mockReturnValue(value);
    });
    vi.spyOn(storage, 'getItem').mockImplementation(getItemFake);

    // Create valid JWT token for testing
    const testToken = await TokenFactory.createToken({
      sub: '1234567890',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600,
    });

    // Mock login endpoint
    const tokenEndpoint = `${ctx.baseUrl}/realms/${ctx.keycloakRealm}/protocol/openid-connect/token`;
    ctx.fetchMock.once(tokenEndpoint, {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      body: {
        access_token: testToken,
        refresh_token: testToken,
        expires_in: 300,
      },
    });

    await ctx.authClient.login(ctx.username, ctx.password);

    // Get the stored token data
    const storedTokenData = JSON.parse(setItemFake.mock.calls[0][1]);

    // Create a new context with the same storage
    const newContext = await createContext();
    vi.spyOn(newContext.localStorageMock, 'getItem').mockImplementation(getItemFake);

    // Initialize the new client and verify token restoration
    await newContext.authClient.init(
      `${ctx.baseUrl}/realms/${ctx.keycloakRealm}`,
      'kontur_platform',
    );

    expect((newContext.authClient as any).token).toBe(storedTokenData.token);
  });
});

describe('Token Parsing', () => {
  test('should parse JWT token', async ({ ctx }) => {
    const now = Math.floor(Date.now() / 1000);
    const validToken = await TokenFactory.createToken({
      sub: '1234567890',
      iat: now,
      exp: now + 3600,
    });

    const result = parseToken(validToken);
    expect(result.expiringDate).toBeInstanceOf(Date);
    expect(result.tokenLifetime).toBe(3600);
  });
});
