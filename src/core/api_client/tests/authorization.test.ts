/**
 * @vitest-environment happy-dom
 */
import { beforeEach, expect, test, describe, vi } from 'vitest';
import fetchMock from '@fetch-mock/vitest';
import { AUTH_REQUIREMENT } from '~core/auth/constants';
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
  MockFactory.resetMocks();
});

describe('Authorization', () => {
  describe('Access Token Management', () => {
    test('should handle MUST requirement when logged in', async ({ ctx }) => {
      await ctx.authClient.login(ctx.username, ctx.password);
      const token = await ctx.authClient.getAccessToken({
        requirement: AUTH_REQUIREMENT.MUST,
      });
      expect(token).toBe(ctx.token);
    });

    test('should throw for MUST requirement when not logged in', async ({ ctx }) => {
      await expect(
        ctx.authClient.getAccessToken({
          requirement: AUTH_REQUIREMENT.MUST,
        }),
      ).rejects.toThrow('Authentication required');
    });

    test('should handle SHOULD requirement when logged in', async ({ ctx }) => {
      await ctx.authClient.login(ctx.username, ctx.password);
      const token = await ctx.authClient.getAccessToken({
        requirement: AUTH_REQUIREMENT.SHOULD,
      });
      expect(token).toBe(ctx.token);
    });

    test('should return empty for SHOULD requirement when not logged in', async ({
      ctx,
    }) => {
      const token = await ctx.authClient.getAccessToken({
        requirement: AUTH_REQUIREMENT.SHOULD,
      });
      expect(token).toBe('');
    });

    test('should handle OPTIONAL requirement when logged in', async ({ ctx }) => {
      await ctx.authClient.login(ctx.username, ctx.password);
      const token = await ctx.authClient.getAccessToken({
        requirement: AUTH_REQUIREMENT.OPTIONAL,
      });
      expect(token).toBe(ctx.token);
    });

    test('should return empty for OPTIONAL requirement when not logged in', async ({
      ctx,
    }) => {
      const token = await ctx.authClient.getAccessToken({
        requirement: AUTH_REQUIREMENT.OPTIONAL,
      });
      expect(token).toBe('');
    });
  });

  describe('Token Refresh', () => {
    test('should refresh token for MUST requirement when token is expiring', async ({
      ctx,
    }) => {
      // Setup initial login with expiring token
      const expiringToken = {
        token: ctx.expiredToken,
        refreshToken: ctx.refreshToken,
        expiresAt: new Date(Date.now() + 1000).toISOString(), // Expiring soon
        refreshExpiresAt: new Date(Date.now() + 7200000).toISOString(),
      };

      vi.spyOn(ctx.localStorageMock, 'getItem').mockReturnValue(
        JSON.stringify(expiringToken),
      );

      await ctx.authClient.init(
        `${ctx.baseUrl}/realms/${ctx.keycloakRealm}`,
        'kontur_platform',
      );

      // Setup successful refresh
      await MockFactory.setupSuccessfulAuth({
        baseUrl: ctx.baseUrl,
        realm: ctx.keycloakRealm,
      });

      const token = await ctx.authClient.getAccessToken({
        requirement: AUTH_REQUIREMENT.MUST,
      });
      expect(token).toBe(ctx.token);
    });

    test('should not refresh token for OPTIONAL requirement when token is expiring', async ({
      ctx,
    }) => {
      // Setup initial login with expiring token
      const expiringToken = {
        token: ctx.token,
        refreshToken: ctx.refreshToken,
        expiresAt: new Date(Date.now() + 1000).toISOString(), // Expiring soon
        refreshExpiresAt: new Date(Date.now() + 7200000).toISOString(),
      };

      vi.spyOn(ctx.localStorageMock, 'getItem').mockReturnValue(
        JSON.stringify(expiringToken),
      );

      await ctx.authClient.init(
        `${ctx.baseUrl}/realms/${ctx.keycloakRealm}`,
        'kontur_platform',
      );

      const token = await ctx.authClient.getAccessToken({
        requirement: AUTH_REQUIREMENT.OPTIONAL,
      });
      expect(token).toBe(ctx.token);
    });

    test('should attempt refresh for SHOULD requirement when token is expiring', async ({
      ctx,
    }) => {
      // Setup initial login with expiring token
      const expiringToken = {
        token: ctx.token,
        refreshToken: ctx.refreshToken,
        expiresAt: new Date(Date.now() + 1000).toISOString(), // Expiring soon
        refreshExpiresAt: new Date(Date.now() + 7200000).toISOString(),
      };

      vi.spyOn(ctx.localStorageMock, 'getItem').mockReturnValue(
        JSON.stringify(expiringToken),
      );

      await ctx.authClient.init(
        `${ctx.baseUrl}/realms/${ctx.keycloakRealm}`,
        'kontur_platform',
      );

      // Setup successful refresh
      await MockFactory.setupSuccessfulAuth({
        baseUrl: ctx.baseUrl,
        realm: ctx.keycloakRealm,
      });

      const token = await ctx.authClient.getAccessToken({
        requirement: AUTH_REQUIREMENT.SHOULD,
      });
      expect(token).toBe(ctx.token);
    });
  });
});
