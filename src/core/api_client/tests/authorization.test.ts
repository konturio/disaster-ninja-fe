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

  it('should successfully refresh token and retry request on 401', async ({ ctx }) => {
    // Setup initial expired token
    const expiredToken = await TokenFactory.createExpiredToken();
    const newToken = await TokenFactory.createToken();

    // Setup initial auth state
    await MockFactory.setupSuccessfulAuth({
      baseUrl: ctx.baseUrl,
      realm: ctx.keycloakRealm,
    });
    await ctx.authClient.login(ctx.username, ctx.password);

    // First request fails with 401
    MockFactory.setupApiError(
      '/protected-data',
      {
        kind: 'unauthorized',
        message: 'Token expired',
        data: 'Token expired',
      },
      'GET',
    );

    // Token refresh succeeds
    await MockFactory.setupSuccessfulAuth(
      {
        baseUrl: ctx.baseUrl,
        realm: ctx.keycloakRealm,
      },
      newToken,
    );

    // Second request succeeds with new token
    MockFactory.setupSuccessfulResponse(
      '/protected-data',
      { data: 'success' },
      {
        method: 'get',
        headers: { Authorization: `Bearer ${newToken}` },
      },
    );

    const response = await ctx.apiClient.get('/protected-data', undefined, {
      authRequirement: AUTH_REQUIREMENT.MUST,
      errorsConfig: { hideErrors: true },
    });

    expect(response).toEqual({ data: 'success' });
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
    MockFactory.setupApiError(
      '/protected-data',
      {
        kind: 'unauthorized',
        message: 'Token expired',
        data: 'Token expired',
      },
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
        message: 'Token expired',
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
    expect(error.message).toBe('Token expired');

    // 11. Clean up
    vi.restoreAllMocks();
  });

  it('should prevent infinite refresh loops on repeated 401s', async ({ ctx }) => {
    // Setup initial auth state
    await MockFactory.setupSuccessfulAuth({
      baseUrl: ctx.baseUrl,
      realm: ctx.keycloakRealm,
    });
    await ctx.authClient.login(ctx.username, ctx.password);

    // First request fails with 401
    MockFactory.setupApiError(
      '/protected-data',
      {
        kind: 'unauthorized',
        message: 'Token expired',
        data: 'Token expired',
      },
      'GET',
    );

    // Token refresh succeeds but subsequent request still fails
    const newToken = await TokenFactory.createToken();
    await MockFactory.setupSuccessfulAuth(
      {
        baseUrl: ctx.baseUrl,
        realm: ctx.keycloakRealm,
      },
      newToken,
    );

    // Second request also fails with 401
    MockFactory.setupApiError(
      '/protected-data',
      {
        kind: 'unauthorized',
        message: 'Still unauthorized',
        data: 'Still unauthorized',
      },
      'GET',
    );

    const error = (await ctx.apiClient
      .get('/protected-data', undefined, {
        authRequirement: AUTH_REQUIREMENT.MUST,
        errorsConfig: { hideErrors: true },
      })
      .catch((e) => e)) as ApiClientError;

    expect(getApiErrorKind(error)).toBe('unauthorized');
    expect(error.message).toBe('Still unauthorized');
  });

  it('should throw original error when refresh returns null token', async ({ ctx }) => {
    // Setup initial 401 error
    MockFactory.setupApiError(
      '/protected-data',
      {
        kind: 'unauthorized',
        message: 'Token expired',
        data: 'Token expired',
      },
      'GET',
    );

    // Mock auth service to return null token
    vi.spyOn(ctx.apiClient.authService, 'getAccessToken').mockResolvedValue('');

    const error = (await ctx.apiClient
      .get('/protected-data', undefined, {
        authRequirement: AUTH_REQUIREMENT.MUST,
        errorsConfig: { hideErrors: true },
      })
      .catch((e) => e)) as ApiClientError;

    expect(getApiErrorKind(error)).toBe('unauthorized');
    expect(error.message).toBe('Token expired');
  });
});
