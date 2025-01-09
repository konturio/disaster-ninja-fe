/**
 * @vitest-environment happy-dom
 */
import { beforeEach, expect, test, describe, vi } from 'vitest';
import { ApiClientError } from '../api_client/apiClientError';
import { createContext } from '../api_client/tests/_clientTestsContext';
import { MockFactory } from '../api_client/tests/factories/mock.factory';
import {
  AUTH_REQUIREMENT,
  LOCALSTORAGE_AUTH_KEY,
  SESSION_STATE,
  TIME_TO_REFRESH_MS,
} from './constants';
import type { TestContext } from '../api_client/tests/_clientTestsContext';

declare module 'vitest' {
  interface TestContext {
    ctx: Awaited<ReturnType<typeof createContext>>;
  }
}

describe('OidcSimpleClient', () => {
  beforeEach(async (context) => {
    context.ctx = await createContext();
    // Setup logout endpoint for all tests
    MockFactory.setupLogoutEndpoint({
      baseUrl: context.ctx.baseUrl,
      realm: context.ctx.keycloakRealm,
    });
  });

  describe('Token Management', () => {
    test('should handle valid token storage and retrieval', async ({ ctx }) => {
      const tokenData = {
        token: ctx.token,
        refreshToken: ctx.refreshToken,
        expiresAt: new Date(Date.now() + 3600000).toISOString(),
        refreshExpiresAt: new Date(Date.now() + 7200000).toISOString(),
      };

      vi.spyOn(ctx.localStorageMock, 'getItem').mockReturnValue(
        JSON.stringify(tokenData),
      );

      await ctx.authClient.init(
        `${ctx.baseUrl}/realms/${ctx.keycloakRealm}`,
        'kontur_platform',
      );
      expect(ctx.authClient.isUserLoggedIn).toBe(true);
      expect(
        await ctx.authClient.getAccessToken({ requirement: AUTH_REQUIREMENT.MUST }),
      ).toBe(ctx.token);
    });

    test('should handle token validation errors', async ({ ctx }) => {
      const invalidToken = 'invalid_token';
      const tokenData = {
        token: invalidToken,
        refreshToken: ctx.refreshToken,
        expiresAt: new Date(Date.now() + 3600000).toISOString(),
        refreshExpiresAt: new Date(Date.now() + 7200000).toISOString(),
      };

      vi.spyOn(ctx.localStorageMock, 'getItem').mockReturnValue(
        JSON.stringify(tokenData),
      );

      await ctx.authClient.init(
        `${ctx.baseUrl}/realms/${ctx.keycloakRealm}`,
        'kontur_platform',
      );
      expect(ctx.authClient.isUserLoggedIn).toBe(false);
      expect(ctx.authClient['token']).toBe('');
    });
  });

  describe('Token Refresh', () => {
    test('should handle concurrent refresh requests', async ({ ctx }) => {
      // Reset and set up all mocks first
      MockFactory.resetMocks();

      // Set up initial token state with expired access token but valid refresh token
      const initialTokenData = {
        token: ctx.expiredToken,
        refreshToken: ctx.refreshToken,
        expiresAt: new Date(Date.now() - 1000).toISOString(), // Expired access token
        refreshExpiresAt: new Date(Date.now() + 7200000).toISOString(), // Valid refresh token (2 hours)
      };

      // Mock storage to return initial token state
      const getItemSpy = vi.spyOn(ctx.localStorageMock, 'getItem');
      const setItemSpy = vi.spyOn(ctx.localStorageMock, 'setItem');

      // Always return the initial token data from storage
      getItemSpy.mockReturnValue(JSON.stringify(initialTokenData));

      // Set up the refresh token response with the same tokens from context
      await MockFactory.setupSuccessfulAuth(
        {
          baseUrl: ctx.baseUrl,
          realm: ctx.keycloakRealm,
        },
        ctx.token, // This will be the new token after refresh
      );

      // Initialize the client with the expired token
      await ctx.authClient.init(
        `${ctx.baseUrl}/realms/${ctx.keycloakRealm}`,
        'kontur_platform',
      );

      // Set up initial auth state
      ctx.authClient['token'] = ctx.expiredToken;
      ctx.authClient['refreshToken'] = ctx.refreshToken;
      ctx.authClient['setSessionState'](SESSION_STATE.VALID);

      // Mock validateTokenState to return true for the new token
      vi.spyOn(ctx.authClient as any, 'validateTokenState').mockImplementation(
        (state: any) => {
          // Return true for the new token, false for the expired token
          return state.token === ctx.token;
        },
      );

      // Mock isRefreshTokenExpired to always return false
      vi.spyOn(ctx.authClient as any, 'isRefreshTokenExpired').mockReturnValue(false);

      // Make concurrent requests - this should trigger a token refresh
      const requests = Array(5)
        .fill(null)
        .map(() => ctx.authClient.getAccessToken({ requirement: AUTH_REQUIREMENT.MUST }));
      const tokens = await Promise.all(requests);

      // All requests should get the same new token
      expect(new Set(tokens).size).toBe(1);
      expect(tokens[0]).toBe(ctx.token);

      // Storage should be updated with new token
      expect(setItemSpy).toHaveBeenCalled();
      const lastCall = setItemSpy.mock.calls[setItemSpy.mock.calls.length - 1];
      expect(lastCall[0]).toBe(LOCALSTORAGE_AUTH_KEY);
      const savedState = JSON.parse(lastCall[1]);
      expect(savedState.token).toBe(ctx.token);

      expect(ctx.authClient.isUserLoggedIn).toBe(true);
    });

    test('should handle refresh token errors', async ({ ctx }) => {
      // Reset and set up all mocks first
      MockFactory.resetMocks();

      // Set up initial token state with expired tokens
      const tokenData = {
        token: ctx.expiredToken,
        refreshToken: 'invalid_refresh_token',
        expiresAt: new Date(Date.now() - 1000).toISOString(), // Expired access token
        refreshExpiresAt: new Date(Date.now() - 1000).toISOString(), // Expired refresh token
      };

      vi.spyOn(ctx.localStorageMock, 'getItem').mockReturnValue(
        JSON.stringify(tokenData),
      );

      // Set up the failed auth response
      MockFactory.setupFailedAuth({
        baseUrl: ctx.baseUrl,
        realm: ctx.keycloakRealm,
      });

      // Set up the logout endpoint
      MockFactory.setupLogoutEndpoint({
        baseUrl: ctx.baseUrl,
        realm: ctx.keycloakRealm,
      });

      await ctx.authClient.init(
        `${ctx.baseUrl}/realms/${ctx.keycloakRealm}`,
        'kontur_platform',
      );

      try {
        await ctx.authClient.getAccessToken({ requirement: AUTH_REQUIREMENT.MUST });
        throw new Error('Should have failed token refresh');
      } catch (e) {
        expect(e).toBeInstanceOf(ApiClientError);
        expect((e as ApiClientError).problem.kind).toBe('unauthorized');
        expect(ctx.authClient.isUserLoggedIn).toBe(false);
        expect(ctx.authClient['token']).toBe('');
      }
    });
  });

  describe('Session Management', () => {
    test('should handle end session flow', async ({ ctx }) => {
      // Reset and set up all mocks first
      MockFactory.resetMocks();

      // Set up initial token state with valid tokens that don't need refresh
      const tokenData = {
        token: ctx.token,
        refreshToken: ctx.refreshToken,
        expiresAt: new Date(Date.now() + 3600000).toISOString(), // Valid for 1 hour
        refreshExpiresAt: new Date(Date.now() + 7200000).toISOString(), // Valid for 2 hours
      };

      // Mock storage to return token data
      vi.spyOn(ctx.localStorageMock, 'getItem').mockReturnValue(
        JSON.stringify(tokenData),
      );

      // Set up the logout endpoint first
      MockFactory.setupLogoutEndpoint({
        baseUrl: ctx.baseUrl,
        realm: ctx.keycloakRealm,
      });

      // Then set up the token endpoint for potential refresh
      await MockFactory.setupSuccessfulAuth(
        {
          baseUrl: ctx.baseUrl,
          realm: ctx.keycloakRealm,
        },
        ctx.token,
      );

      await ctx.authClient.init(
        `${ctx.baseUrl}/realms/${ctx.keycloakRealm}`,
        'kontur_platform',
      );
      expect(ctx.authClient.isUserLoggedIn).toBe(true);

      await ctx.authClient.logout(false); // Pass false to prevent page reload
      expect(ctx.authClient.isUserLoggedIn).toBe(false);
      expect(ctx.authClient['token']).toBe('');
    });

    test('should handle session errors', async ({ ctx }) => {
      // Reset and set up all mocks first
      MockFactory.resetMocks();

      // Set up initial token state with valid tokens that don't need refresh
      const tokenData = {
        token: ctx.token,
        refreshToken: ctx.refreshToken,
        expiresAt: new Date(Date.now() + 3600000).toISOString(), // Valid for 1 hour
        refreshExpiresAt: new Date(Date.now() + 7200000).toISOString(), // Valid for 2 hours
      };

      // Mock storage to return token data
      const getItemSpy = vi.spyOn(ctx.localStorageMock, 'getItem');
      getItemSpy.mockReturnValue(JSON.stringify(tokenData));

      // Set up the logout endpoint first
      MockFactory.setupLogoutEndpoint({
        baseUrl: ctx.baseUrl,
        realm: ctx.keycloakRealm,
      });

      // Then set up the token endpoint for potential refresh
      await MockFactory.setupSuccessfulAuth(
        {
          baseUrl: ctx.baseUrl,
          realm: ctx.keycloakRealm,
        },
        ctx.token,
      );

      await ctx.authClient.init(
        `${ctx.baseUrl}/realms/${ctx.keycloakRealm}`,
        'kontur_platform',
      );
      expect(ctx.authClient.isUserLoggedIn).toBe(true);

      // Mock storage errors
      const removeItemSpy = vi
        .spyOn(ctx.localStorageMock, 'removeItem')
        .mockImplementation(() => {
          throw new Error('Storage error');
        });

      // Mock setItem to also throw to simulate complete storage failure
      vi.spyOn(ctx.localStorageMock, 'setItem').mockImplementation(() => {
        throw new Error('Storage error');
      });

      // Mock getItem to throw after init to simulate complete storage failure
      getItemSpy.mockImplementation(() => {
        throw new Error('Storage error');
      });

      try {
        // Logout should still succeed even if storage fails
        await ctx.authClient.logout(false); // Pass false to prevent page reload
      } catch (e) {
        // We expect a storage error, but the client should still be logged out
        expect(e instanceof Error).toBe(true);
        expect((e as Error).message).toBe('Storage error');
      }

      expect(removeItemSpy).toHaveBeenCalledWith(LOCALSTORAGE_AUTH_KEY);
      expect(ctx.authClient.isUserLoggedIn).toBe(false);
      expect(ctx.authClient['token']).toBe('');
    });
  });

  describe('Token Validation', () => {
    test('should reject tokens with potential XSS payloads', async ({ ctx }) => {
      const maliciousTokens = [
        'header.<script>alert(1)</script>.signature',
        'header.payload.javascript:alert(1)',
        'header.data:text/html.signature',
        'header.\\u0061lert.signature',
        'header.onclick=alert(1).signature',
      ];

      for (const token of maliciousTokens) {
        try {
          await ctx.authClient['sanitizeToken'](token);
          throw new Error('Should have rejected malicious token');
        } catch (e) {
          expect(e).toBeInstanceOf(ApiClientError);
          expect((e as ApiClientError).problem.kind).toBe('bad-data');
        }
      }
    });

    test('should reject malformed JWT tokens', async ({ ctx }) => {
      const malformedTokens = [
        'not.a.valid.token',
        'missing.parts',
        'header..signature',
        'header.payload',
        '',
      ];

      for (const token of malformedTokens) {
        try {
          await ctx.authClient['sanitizeToken'](token);
          throw new Error('Should have rejected malformed token');
        } catch (e) {
          expect(e).toBeInstanceOf(ApiClientError);
          expect((e as ApiClientError).problem.kind).toBe('bad-data');
        }
      }
    });
  });

  describe('Token State Management', () => {
    test('should handle storage errors during token update', async ({ ctx }) => {
      vi.spyOn(ctx.localStorageMock, 'setItem').mockImplementation(() => {
        throw new Error('Storage error');
      });

      const newState = {
        token: ctx.token,
        refreshToken: ctx.refreshToken,
        expiresAt: new Date(Date.now() + 3600000),
        refreshExpiresAt: new Date(Date.now() + 7200000),
      };

      try {
        await ctx.authClient['updateTokenState'](newState);
        throw new Error('Should have failed on storage error');
      } catch (e) {
        expect(e).toBeInstanceOf(ApiClientError);
        expect((e as ApiClientError).problem.kind).toBe('bad-data');
        expect(ctx.authClient.isUserLoggedIn).toBe(false);
        expect(ctx.authClient['token']).toBe('');
      }
    });

    test('should handle preemptive token refresh failure gracefully', async ({ ctx }) => {
      MockFactory.resetMocks();

      // Set up initial token state with soon-to-expire token
      const tokenData = {
        token: ctx.token,
        refreshToken: ctx.refreshToken,
        expiresAt: new Date(Date.now() + TIME_TO_REFRESH_MS / 2).toISOString(),
        refreshExpiresAt: new Date(Date.now() + 7200000).toISOString(),
      };

      vi.spyOn(ctx.localStorageMock, 'getItem').mockReturnValue(
        JSON.stringify(tokenData),
      );

      // Set up the logout endpoint first
      MockFactory.setupLogoutEndpoint({
        baseUrl: ctx.baseUrl,
        realm: ctx.keycloakRealm,
      });

      // Set up initial successful auth
      await MockFactory.setupSuccessfulAuth({
        baseUrl: ctx.baseUrl,
        realm: ctx.keycloakRealm,
      });

      // Initialize client with valid token
      await ctx.authClient.init(
        `${ctx.baseUrl}/realms/${ctx.keycloakRealm}`,
        'kontur_platform',
      );

      // Now make refresh fail but keep current token valid
      MockFactory.resetMocks();
      MockFactory.setupFailedAuth({
        baseUrl: ctx.baseUrl,
        realm: ctx.keycloakRealm,
      });

      // Should still be able to get token
      const token = await ctx.authClient.getAccessToken();
      expect(token).toBe(ctx.token);
      expect(ctx.authClient.isUserLoggedIn).toBe(true);
    });
  });

  describe('Authentication Flow', () => {
    test('should handle login with invalid credentials', async ({ ctx }) => {
      MockFactory.resetMocks();
      MockFactory.setupFailedAuth({
        baseUrl: ctx.baseUrl,
        realm: ctx.keycloakRealm,
      });

      let error: unknown;
      try {
        await ctx.authClient.login('invalid', 'credentials');
      } catch (e) {
        error = e;
      }

      expect(error).toBeInstanceOf(ApiClientError);
      if (error instanceof ApiClientError) {
        expect(error.message).toBe('Invalid credentials');
        expect(error.problem.kind).toBe('unauthorized');
        if (error.problem.kind === 'unauthorized') {
          expect(error.problem.data).toBe('Invalid credentials');
        }
      }
      expect(ctx.authClient.isUserLoggedIn).toBe(false);
    });

    test('should handle high-level authentication with invalid credentials', async ({
      ctx,
    }) => {
      MockFactory.resetMocks();
      MockFactory.setupFailedAuth({
        baseUrl: ctx.baseUrl,
        realm: ctx.keycloakRealm,
      });

      const result = await ctx.authClient.authenticate('invalid', 'credentials');
      expect(result).toBe('Invalid credentials');
      expect(ctx.authClient.isUserLoggedIn).toBe(false);
    });

    test('should handle server errors during authentication', async ({ ctx }) => {
      MockFactory.resetMocks();
      const tokenEndpoint = `${ctx.baseUrl}/realms/${ctx.keycloakRealm}/protocol/openid-connect/token`;

      ctx.fetchMock.post(tokenEndpoint, {
        status: 500,
        body: {
          error: 'server_error',
          error_description: 'Internal Server Error',
        },
      });

      const result = await ctx.authClient.authenticate('user', 'password');
      expect(result).toBe('Internal Server Error');
      expect(ctx.authClient.isUserLoggedIn).toBe(false);
    });

    test('should handle successful authentication', async ({ ctx }) => {
      MockFactory.resetMocks();
      await MockFactory.setupSuccessfulAuth({
        baseUrl: ctx.baseUrl,
        realm: ctx.keycloakRealm,
      });

      const result = await ctx.authClient.authenticate('valid', 'password');
      expect(result).toBe(true);
      expect(ctx.authClient.isUserLoggedIn).toBe(true);
    });
  });

  describe('Token Refresh Flow', () => {
    beforeEach(() => {
      MockFactory.resetMocks();
    });

    test('should not refresh when token is valid', async ({ ctx }) => {
      const tokenData = {
        token: ctx.token,
        refreshToken: ctx.refreshToken,
        expiresAt: new Date(Date.now() + 3600000).toISOString(), // Valid for 1 hour
        refreshExpiresAt: new Date(Date.now() + 7200000).toISOString(),
      };

      vi.spyOn(ctx.localStorageMock, 'getItem').mockReturnValue(
        JSON.stringify(tokenData),
      );

      // Mock shouldRefreshToken to return false
      vi.spyOn(ctx.authClient as any, 'shouldRefreshToken').mockReturnValue(false);

      const refreshSpy = vi.spyOn(ctx.authClient as any, 'refreshAuthToken');
      await ctx.authClient['_tokenRefreshFlow']();

      expect(refreshSpy).not.toHaveBeenCalled();
    });

    test('should force refresh when token must be refreshed', async ({ ctx }) => {
      const tokenData = {
        token: ctx.expiredToken,
        refreshToken: ctx.refreshToken,
        expiresAt: new Date(Date.now() - 1000).toISOString(), // Expired
        refreshExpiresAt: new Date(Date.now() + 7200000).toISOString(),
      };

      vi.spyOn(ctx.localStorageMock, 'getItem').mockReturnValue(
        JSON.stringify(tokenData),
      );

      // Setup successful auth response
      await MockFactory.setupSuccessfulAuth({
        baseUrl: ctx.baseUrl,
        realm: ctx.keycloakRealm,
      });

      // Mock isRefreshTokenExpired to return false
      vi.spyOn(ctx.authClient as any, 'isRefreshTokenExpired').mockReturnValue(false);

      // Mock shouldRefreshToken to return AUTH_REQUIREMENT.MUST
      vi.spyOn(ctx.authClient as any, 'shouldRefreshToken').mockReturnValue(
        AUTH_REQUIREMENT.MUST,
      );

      const refreshSpy = vi.spyOn(ctx.authClient as any, 'refreshAuthToken');
      await ctx.authClient['_tokenRefreshFlow']();

      expect(refreshSpy).toHaveBeenCalled();
    });

    test('should handle preemptive refresh failure gracefully', async ({ ctx }) => {
      // Set up initial token state
      const tokenData = {
        token: ctx.token,
        refreshToken: ctx.refreshToken,
        expiresAt: new Date(Date.now() + TIME_TO_REFRESH_MS / 2).toISOString(),
        refreshExpiresAt: new Date(Date.now() + 7200000).toISOString(),
      };

      // Mock storage and token state
      vi.spyOn(ctx.localStorageMock, 'getItem').mockReturnValue(
        JSON.stringify(tokenData),
      );

      // Mock token validation to return true for the current token
      vi.spyOn(ctx.authClient as any, 'validateTokenState').mockImplementation(
        (state: any) => {
          return state.token === ctx.token;
        },
      );

      // Mock token expiration check
      vi.spyOn(ctx.authClient as any, 'tokenExpirationDate', 'get').mockReturnValue(
        new Date(Date.now() + TIME_TO_REFRESH_MS / 2),
      );

      // Mock shouldRefreshToken to return AUTH_REQUIREMENT.SHOULD
      vi.spyOn(ctx.authClient as any, 'shouldRefreshToken').mockReturnValue(
        AUTH_REQUIREMENT.SHOULD,
      );

      // Mock isRefreshTokenExpired to return false
      vi.spyOn(ctx.authClient as any, 'isRefreshTokenExpired').mockReturnValue(false);

      // Set up server error response for token endpoint
      const tokenEndpoint = `${ctx.baseUrl}/realms/${ctx.keycloakRealm}/protocol/openid-connect/token`;
      ctx.fetchMock.post(tokenEndpoint, {
        status: 500,
        body: {
          error: 'server_error',
          error_description: 'Internal Server Error',
        },
      });

      // Set up token state
      ctx.authClient['token'] = ctx.token;
      ctx.authClient['refreshToken'] = ctx.refreshToken;
      ctx.authClient['setSessionState'](SESSION_STATE.VALID);

      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const result = await ctx.authClient['_tokenRefreshFlow']();

      expect(result).toBe(true);
      expect(consoleSpy).toHaveBeenCalledWith(
        'Preemptive token refresh failed, using existing token:',
        expect.any(Error),
      );
      expect(ctx.authClient.isUserLoggedIn).toBe(true);
    });

    test('should handle network errors during forced refresh', async ({ ctx }) => {
      const tokenData = {
        token: ctx.expiredToken,
        refreshToken: ctx.refreshToken,
        expiresAt: new Date(Date.now() - 1000).toISOString(), // Expired
        refreshExpiresAt: new Date(Date.now() + 7200000).toISOString(),
      };

      vi.spyOn(ctx.localStorageMock, 'getItem').mockReturnValue(
        JSON.stringify(tokenData),
      );

      // Initialize client state
      await ctx.authClient.init(
        `${ctx.baseUrl}/realms/${ctx.keycloakRealm}`,
        'kontur_platform',
      );

      // Mock shouldRefreshToken to return AUTH_REQUIREMENT.MUST
      vi.spyOn(ctx.authClient as any, 'shouldRefreshToken').mockReturnValue(
        AUTH_REQUIREMENT.MUST,
      );

      // Mock isRefreshTokenExpired to return false
      vi.spyOn(ctx.authClient as any, 'isRefreshTokenExpired').mockReturnValue(false);

      const tokenEndpoint = `${ctx.baseUrl}/realms/${ctx.keycloakRealm}/protocol/openid-connect/token`;
      ctx.fetchMock.post(tokenEndpoint, () => Promise.reject(new Error('Network error')));

      try {
        await ctx.authClient['_tokenRefreshFlow']();
        throw new Error('Should have failed');
      } catch (e) {
        expect(e).toBeInstanceOf(ApiClientError);
        expect((e as ApiClientError).problem.kind).toBe('client-unknown');
        expect(ctx.authClient.isUserLoggedIn).toBe(false);
        expect(ctx.authClient['token']).toBe('');
      }
    });

    test('should handle concurrent refresh requests', async ({ ctx }) => {
      const tokenData = {
        token: ctx.expiredToken,
        refreshToken: ctx.refreshToken,
        expiresAt: new Date(Date.now() - 1000).toISOString(), // Expired
        refreshExpiresAt: new Date(Date.now() + 7200000).toISOString(),
      };

      vi.spyOn(ctx.localStorageMock, 'getItem').mockReturnValue(
        JSON.stringify(tokenData),
      );

      // Mock shouldRefreshToken to return AUTH_REQUIREMENT.MUST
      vi.spyOn(ctx.authClient as any, 'shouldRefreshToken').mockReturnValue(
        AUTH_REQUIREMENT.MUST,
      );

      // Mock isRefreshTokenExpired to return false
      vi.spyOn(ctx.authClient as any, 'isRefreshTokenExpired').mockReturnValue(false);

      await MockFactory.setupSuccessfulAuth({
        baseUrl: ctx.baseUrl,
        realm: ctx.keycloakRealm,
      });

      // Multiple concurrent refresh attempts
      const results = await Promise.all([
        ctx.authClient['_tokenRefreshFlow'](),
        ctx.authClient['_tokenRefreshFlow'](),
        ctx.authClient['_tokenRefreshFlow'](),
      ]);

      expect(results.every((r) => r === true)).toBe(true);
      expect(ctx.authClient.isUserLoggedIn).toBe(true);
    });
  });

  describe('Real-World Scenarios', () => {
    beforeEach(() => {
      MockFactory.resetMocks();
    });

    test('should handle private browsing storage limitations', async ({ ctx }) => {
      await MockFactory.setupSuccessfulAuth({
        baseUrl: ctx.baseUrl,
        realm: ctx.keycloakRealm,
      });

      vi.spyOn(ctx.localStorageMock, 'setItem').mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });

      try {
        await ctx.authClient.login('user', 'password');
        throw new Error('Should have failed on storage error');
      } catch (e) {
        expect(e).toBeInstanceOf(ApiClientError);
        expect((e as ApiClientError).problem.kind).toBe('bad-data');
        expect(ctx.authClient.isUserLoggedIn).toBe(false);
        expect(ctx.authClient['token']).toBe('');
      }
    });
  });
});
