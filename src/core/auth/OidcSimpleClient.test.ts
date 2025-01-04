/**
 * @vitest-environment happy-dom
 */
import { beforeEach, expect, test, describe, vi } from 'vitest';
import { ApiClientError } from '../api_client/apiClientError';
import { createContext } from '../api_client/tests/_clientTestsContext';
import { MockFactory } from '../api_client/tests/factories/mock.factory';
import { LOCALSTORAGE_AUTH_KEY } from './OidcSimpleClient';
import type { TestContext } from '../api_client/tests/_clientTestsContext';

declare module 'vitest' {
  interface TestContext {
    ctx: Awaited<ReturnType<typeof createContext>>;
  }
}

describe('OidcSimpleClient', () => {
  beforeEach(async (context) => {
    context.ctx = await createContext();
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
      expect(await ctx.authClient.getAccessToken()).toBe(ctx.token);
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
        .map(() => ctx.authClient.getAccessToken());
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
        await ctx.authClient.getAccessToken();
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
});
