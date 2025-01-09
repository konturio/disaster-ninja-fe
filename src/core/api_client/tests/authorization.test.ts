/**
 * @vitest-environment happy-dom
 */
import { beforeEach, expect, test, describe, vi } from 'vitest';
import { AUTH_REQUIREMENT, SESSION_STATE } from '~core/auth/constants';
import { createContext } from './_clientTestsContext';
import { TokenFactory } from './factories/token.factory';
import { MockFactory } from './factories/mock.factory';
import { AuthFactory } from './factories/auth.factory';

declare module 'vitest' {
  interface TestContext {
    ctx: Awaited<ReturnType<typeof createContext>>;
  }
}

describe('Authorization', () => {
  beforeEach(async (context) => {
    // 1. Create context
    context.ctx = await createContext();
    // 2. Reset all mocks
    MockFactory.resetMocks();
    // 3. Setup default endpoints
    MockFactory.setupOidcConfiguration({
      baseUrl: context.ctx.baseUrl,
      realm: context.ctx.keycloakRealm,
    });
  });

  describe('Access Token Management', () => {
    test('should handle MUST requirement when logged in', async ({ ctx }) => {
      // Setup
      await MockFactory.setupSuccessfulAuth({
        baseUrl: ctx.baseUrl,
        realm: ctx.keycloakRealm,
      });

      // Execute
      await ctx.authClient.login(ctx.username, ctx.password);
      const token = await ctx.authClient.getAccessToken({
        requirement: AUTH_REQUIREMENT.MUST,
      });

      // Verify
      expect(token).toBe(ctx.token);
    });

    test('should throw for MUST requirement when not logged in', async ({ ctx }) => {
      // Execute & Verify
      await expect(
        ctx.authClient.getAccessToken({
          requirement: AUTH_REQUIREMENT.MUST,
        }),
      ).rejects.toThrow('Authentication required');
    });

    test('should handle SHOULD requirement when logged in', async ({ ctx }) => {
      // Setup
      await MockFactory.setupSuccessfulAuth({
        baseUrl: ctx.baseUrl,
        realm: ctx.keycloakRealm,
      });

      // Execute
      await ctx.authClient.login(ctx.username, ctx.password);
      const token = await ctx.authClient.getAccessToken({
        requirement: AUTH_REQUIREMENT.SHOULD,
      });

      // Verify
      expect(token).toBe(ctx.token);
    });

    test('should return empty for SHOULD requirement when not logged in', async ({
      ctx,
    }) => {
      // Execute
      const token = await ctx.authClient.getAccessToken({
        requirement: AUTH_REQUIREMENT.SHOULD,
      });

      // Verify
      expect(token).toBe('');
    });

    test('should handle OPTIONAL requirement when logged in', async ({ ctx }) => {
      // Setup
      await MockFactory.setupSuccessfulAuth({
        baseUrl: ctx.baseUrl,
        realm: ctx.keycloakRealm,
      });

      // Execute
      await ctx.authClient.login(ctx.username, ctx.password);
      const token = await ctx.authClient.getAccessToken({
        requirement: AUTH_REQUIREMENT.OPTIONAL,
      });

      // Verify
      expect(token).toBe(ctx.token);
    });

    test('should return empty for OPTIONAL requirement when not logged in', async ({
      ctx,
    }) => {
      // Execute
      const token = await ctx.authClient.getAccessToken({
        requirement: AUTH_REQUIREMENT.OPTIONAL,
      });

      // Verify
      expect(token).toBe('');
    });
  });

  describe('Token Refresh', () => {
    test('should refresh token for MUST requirement when token is expiring', async ({
      ctx,
    }) => {
      // Setup
      const expiringToken = await TokenFactory.createToken({
        expiresIn: 1, // Expiring in 1 second
      });
      const refreshToken = await TokenFactory.createRefreshToken();

      const tokenData = {
        token: expiringToken,
        refreshToken: refreshToken,
        expiresAt: new Date(Date.now() + 1000).toISOString(),
        refreshExpiresAt: new Date(Date.now() + 7200000).toISOString(),
      };

      // Mock storage and token state
      vi.spyOn(ctx.localStorageMock, 'getItem').mockReturnValue(
        JSON.stringify(tokenData),
      );
      await ctx.authClient.init(
        `${ctx.baseUrl}/realms/${ctx.keycloakRealm}`,
        'kontur_platform',
      );
      ctx.authClient['token'] = expiringToken;
      ctx.authClient['refreshToken'] = refreshToken;
      ctx.authClient['setSessionState'](SESSION_STATE.VALID);

      // Mock token validation and refresh behavior
      vi.spyOn(ctx.authClient as any, 'shouldRefreshToken').mockReturnValue(
        AUTH_REQUIREMENT.MUST,
      );
      vi.spyOn(ctx.authClient as any, 'isRefreshTokenExpired').mockReturnValue(false);
      vi.spyOn(ctx.authClient as any, 'validateTokenState').mockImplementation(
        (state: any) => {
          return state.token === ctx.token || state.token === expiringToken;
        },
      );

      // Setup refresh response
      await MockFactory.setupSuccessfulAuth({
        baseUrl: ctx.baseUrl,
        realm: ctx.keycloakRealm,
      });

      // Execute
      const token = await ctx.authClient.getAccessToken({
        requirement: AUTH_REQUIREMENT.MUST,
      });

      // Verify
      expect(token).toBe(ctx.token);
    });

    test('should not refresh token for OPTIONAL requirement when token is expiring', async ({
      ctx,
    }) => {
      // Setup
      const expiringToken = await TokenFactory.createToken({
        expiresIn: 1, // Expiring in 1 second
      });
      const refreshToken = await TokenFactory.createRefreshToken();

      const tokenData = {
        token: expiringToken,
        refreshToken: refreshToken,
        expiresAt: new Date(Date.now() + 1000).toISOString(),
        refreshExpiresAt: new Date(Date.now() + 7200000).toISOString(),
      };

      // Mock storage and token state
      vi.spyOn(ctx.localStorageMock, 'getItem').mockReturnValue(
        JSON.stringify(tokenData),
      );
      await ctx.authClient.init(
        `${ctx.baseUrl}/realms/${ctx.keycloakRealm}`,
        'kontur_platform',
      );
      ctx.authClient['token'] = expiringToken;
      ctx.authClient['refreshToken'] = refreshToken;
      ctx.authClient['setSessionState'](SESSION_STATE.VALID);

      // Mock token validation and refresh behavior
      vi.spyOn(ctx.authClient as any, 'shouldRefreshToken').mockReturnValue(false);
      vi.spyOn(ctx.authClient as any, 'isRefreshTokenExpired').mockReturnValue(false);
      vi.spyOn(ctx.authClient as any, 'validateTokenState').mockImplementation(
        (state: any) => {
          return state.token === expiringToken;
        },
      );

      // Setup refresh response (even though we don't expect it to be used)
      await MockFactory.setupSuccessfulAuth({
        baseUrl: ctx.baseUrl,
        realm: ctx.keycloakRealm,
      });

      // Execute
      const token = await ctx.authClient.getAccessToken({
        requirement: AUTH_REQUIREMENT.OPTIONAL,
      });

      // Verify
      expect(token).toBe(expiringToken); // Should return existing token without refresh
    });

    test('should attempt refresh for SHOULD requirement when token is expiring', async ({
      ctx,
    }) => {
      // Setup
      const expiringToken = await TokenFactory.createToken({
        expiresIn: 1, // Expiring in 1 second
      });
      const refreshToken = await TokenFactory.createRefreshToken();

      const tokenData = {
        token: expiringToken,
        refreshToken: refreshToken,
        expiresAt: new Date(Date.now() + 1000).toISOString(),
        refreshExpiresAt: new Date(Date.now() + 7200000).toISOString(),
      };

      // Mock storage and token state
      vi.spyOn(ctx.localStorageMock, 'getItem').mockReturnValue(
        JSON.stringify(tokenData),
      );
      await ctx.authClient.init(
        `${ctx.baseUrl}/realms/${ctx.keycloakRealm}`,
        'kontur_platform',
      );
      ctx.authClient['token'] = expiringToken;
      ctx.authClient['refreshToken'] = refreshToken;
      ctx.authClient['setSessionState'](SESSION_STATE.VALID);

      // Mock token validation and refresh behavior
      vi.spyOn(ctx.authClient as any, 'shouldRefreshToken').mockReturnValue(
        AUTH_REQUIREMENT.SHOULD,
      );
      vi.spyOn(ctx.authClient as any, 'isRefreshTokenExpired').mockReturnValue(false);
      vi.spyOn(ctx.authClient as any, 'validateTokenState').mockImplementation(
        (state: any) => {
          return state.token === ctx.token || state.token === expiringToken;
        },
      );

      // Setup refresh response
      await MockFactory.setupSuccessfulAuth({
        baseUrl: ctx.baseUrl,
        realm: ctx.keycloakRealm,
      });

      // Execute
      const token = await ctx.authClient.getAccessToken({
        requirement: AUTH_REQUIREMENT.SHOULD,
      });

      // Verify
      expect(token).toBe(ctx.token); // Should get new token after refresh
    });
  });
});
