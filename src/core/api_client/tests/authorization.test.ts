/**
 * @vitest-environment happy-dom
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import fetchMock from '@fetch-mock/vitest';
import { AUTH_REQUIREMENT } from '~core/auth/constants';
import { isApiError, getApiErrorKind } from '../apiClientError';
import { createContext } from './_clientTestsContext';
import { MockFactory } from './factories/mock.factory';
import { TokenFactory } from './factories/token.factory';
import { AuthFactory } from './factories/auth.factory';
import type { ApiClientError } from '../apiClientError';

describe('ApiClient Authorization', () => {
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

  it('should handle unauthorized errors', async ({ ctx }) => {
    const error = await ctx.apiClient
      .get('/protected', undefined, {
        authRequirement: AUTH_REQUIREMENT.MUST,
        errorsConfig: { hideErrors: true },
      })
      .catch((e) => e);

    expect(isApiError(error)).toBe(true);
    expect(getApiErrorKind(error)).toBe('unauthorized');
  });

  it('should handle token refresh failures', async ({ ctx }) => {
    MockFactory.setupFailedAuth({
      baseUrl: ctx.baseUrl,
      realm: ctx.keycloakRealm,
    });

    const error = await ctx.apiClient
      .get('/protected', undefined, {
        authRequirement: AUTH_REQUIREMENT.MUST,
        errorsConfig: { hideErrors: true },
      })
      .catch((e) => e);

    expect(isApiError(error)).toBe(true);
    expect(getApiErrorKind(error)).toBe('unauthorized');
  });

  it('should throw original error when refresh token request fails', async ({ ctx }) => {
    // 1. Reset mocks for clean state
    MockFactory.resetMocks();

    // 2. Setup OIDC configuration
    MockFactory.setupOidcConfiguration({
      baseUrl: ctx.baseUrl,
      realm: ctx.keycloakRealm,
    });

    // 3. Create an expired token for initial auth
    const expiredToken = await TokenFactory.createExpiredToken();

    // 4. Setup initial auth with the expired token
    await MockFactory.setupSuccessfulAuth(
      {
        baseUrl: ctx.baseUrl,
        realm: ctx.keycloakRealm,
      },
      expiredToken,
    );

    // 5. Login (this will store the expired token)
    await ctx.authClient.login(ctx.username, ctx.password);

    // 6. Force token refresh on next request
    const authState = AuthFactory.setupAuthClient(ctx.authClient, { isExpired: true });

    // 7. Setup the API error that will trigger refresh
    const originalError = {
      kind: 'unauthorized' as const,
      data: 'unauthorized',
    };
    MockFactory.setupApiError(
      '/protected-data',
      { ...originalError, message: 'Any' },
      'GET',
    );

    // 8. Setup failed refresh response with 401
    const tokenEndpoint = AuthFactory.getTokenEndpoint({
      baseUrl: ctx.baseUrl,
      realm: ctx.keycloakRealm,
    });

    // Reset any existing token endpoint mocks
    fetchMock.mockReset();
    MockFactory.setupOidcConfiguration({
      baseUrl: ctx.baseUrl,
      realm: ctx.keycloakRealm,
    });

    // Setup the failed refresh response
    fetchMock.post(tokenEndpoint, {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
      body: {
        error: 'unauthorized',
        error_description: 'Token expired',
      },
    });

    // 9. Make the request that will trigger refresh
    const error = (await ctx.apiClient
      .get('/protected-data', undefined, {
        authRequirement: AUTH_REQUIREMENT.MUST,
        errorsConfig: { hideErrors: true },
      })
      .catch((e) => e)) as ApiClientError;

    // 10. Verify error matches original API error
    expect(getApiErrorKind(error)).toBe('unauthorized');

    // 11. Clean up
    vi.restoreAllMocks();
  });

  it('should throw original error when refresh returns null token', async ({ ctx }) => {
    // Setup initial 401 error
    const originalError = {
      kind: 'unauthorized' as const,
      data: 'unauthorized',
    };
    MockFactory.setupApiError(
      '/protected-data',
      { ...originalError, message: 'Any' },
      'GET',
    );

    // Mock auth service to return null token
    vi.spyOn(ctx.apiClient.authService, 'getAccessToken').mockResolvedValue(null);

    const error = (await ctx.apiClient
      .get('/protected-data', undefined, {
        authRequirement: AUTH_REQUIREMENT.MUST,
        errorsConfig: { hideErrors: true },
      })
      .catch((e) => e)) as ApiClientError;

    expect(getApiErrorKind(error)).toBe('unauthorized');
  });

  it('should throw original error on 401 even after successful token refresh', async ({
    ctx,
  }) => {
    // Setup initial auth state
    await MockFactory.setupSuccessfulAuth({
      baseUrl: ctx.baseUrl,
      realm: ctx.keycloakRealm,
    });
    await ctx.authClient.login(ctx.username, ctx.password);

    // Request fails with 401
    const originalError = {
      kind: 'unauthorized' as const,
      data: 'unauthorized',
    };
    MockFactory.setupApiError(
      '/protected-data',
      { ...originalError, message: 'Any' },
      'GET',
    );

    // Token refresh succeeds (but we should still throw original error)
    const newToken = await TokenFactory.createToken();
    await MockFactory.setupSuccessfulAuth(
      {
        baseUrl: ctx.baseUrl,
        realm: ctx.keycloakRealm,
      },
      newToken,
    );

    const error = (await ctx.apiClient
      .get('/protected-data', undefined, {
        authRequirement: AUTH_REQUIREMENT.MUST,
        errorsConfig: { hideErrors: true },
      })
      .catch((e) => e)) as ApiClientError;

    // Verify we get the original error even though token refresh succeeded
    expect(getApiErrorKind(error)).toBe('unauthorized');
  });
});
