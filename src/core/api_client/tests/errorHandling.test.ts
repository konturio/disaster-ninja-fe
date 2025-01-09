/**
 * @vitest-environment happy-dom
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import './mocks/replaceUrlWithProxy.mock';
import { AUTH_REQUIREMENT, SESSION_STATE } from '~core/auth/constants';
import { createContext } from './_clientTestsContext';
import { MockFactory } from './factories/mock.factory';
import { AuthFactory } from './factories/auth.factory';

describe('ApiClient Error Handling', () => {
  let ctx: Awaited<ReturnType<typeof createContext>>;

  beforeEach(async () => {
    // 1. Create context
    ctx = await createContext();
    // 2. Reset all mocks
    MockFactory.resetMocks();
    // 3. Setup default endpoints
    await MockFactory.setupSuccessfulAuth({
      baseUrl: ctx.baseUrl,
      realm: ctx.keycloakRealm,
    });
    MockFactory.setupOidcConfiguration({
      baseUrl: ctx.baseUrl,
      realm: ctx.keycloakRealm,
    });
  });

  it('should handle server errors with custom messages', async () => {
    // 1. Setup error response using MockFactory
    MockFactory.setupApiError(
      '/data',
      {
        kind: 'bad-data',
        message: 'Custom error message',
      },
      'GET',
    );

    // 2. Execute & Verify
    await expect(
      ctx.apiClient.get<{ data: string }>(
        '/data',
        {},
        {
          errorsConfig: {
            messages: {
              422: 'Validation failed',
            },
          },
          authRequirement: AUTH_REQUIREMENT.OPTIONAL,
        },
      ),
    ).rejects.toThrow('Validation failed');
  });

  it('should handle network errors', async () => {
    // 1. Setup using MockFactory pattern
    MockFactory.setupNetworkError('/data');

    // 2. Execute & Verify
    await expect(
      ctx.apiClient.get<{ data: string }>(
        '/data',
        {},
        {
          authRequirement: AUTH_REQUIREMENT.OPTIONAL,
        },
      ),
    ).rejects.toThrow("Can't connect to server");
  });

  it('should handle timeout errors', async () => {
    // 1. Setup using MockFactory pattern
    MockFactory.setupTimeoutError('/data', 'GET');

    // 2. Execute & Verify
    await expect(
      ctx.apiClient.get<{ data: string }>(
        '/data',
        {},
        {
          authRequirement: AUTH_REQUIREMENT.OPTIONAL,
        },
      ),
    ).rejects.toThrow('Request Timeout');
  });

  it('should suppress error events when hideErrors is true', async () => {
    // 1. Setup error listener
    const errorEvents: any[] = [];
    ctx.apiClient.on('error', (error) => errorEvents.push(error));

    // 2. Setup error response using MockFactory
    MockFactory.setupApiError(
      '/data',
      {
        kind: 'bad-data',
        message: 'Error message',
      },
      'GET',
    );

    // 3. Execute & Verify
    await expect(
      ctx.apiClient.get<{ data: string }>(
        '/data',
        {},
        {
          errorsConfig: { hideErrors: true },
          authRequirement: AUTH_REQUIREMENT.OPTIONAL,
        },
      ),
    ).rejects.toThrow();

    expect(errorEvents.length).toBe(0);
  });

  it('should emit error events by default', async () => {
    // 1. Setup error listener
    const errorEvents: any[] = [];
    ctx.apiClient.on('error', (error) => errorEvents.push(error));

    // 2. Setup error response using MockFactory
    MockFactory.setupApiError(
      '/data',
      {
        kind: 'bad-data',
        message: 'bad-data',
      },
      'GET',
    );

    // 3. Execute & Verify
    await expect(
      ctx.apiClient.get<{ data: string }>(
        '/data',
        {},
        {
          authRequirement: AUTH_REQUIREMENT.OPTIONAL,
        },
      ),
    ).rejects.toThrow();

    expect(errorEvents.length).toBe(1);
    expect(errorEvents[0].problem.kind).toBe('unknown');
  });

  it('should handle string error messages', async () => {
    // 1. Setup error response using MockFactory
    MockFactory.setupApiError(
      '/data',
      {
        kind: 'bad-data',
        message: 'Error message',
      },
      'GET',
    );

    // 2. Execute & Verify
    await expect(
      ctx.apiClient.get<{ data: string }>(
        '/data',
        {},
        {
          errorsConfig: {
            messages: 'Custom error',
          },
          authRequirement: AUTH_REQUIREMENT.OPTIONAL,
        },
      ),
    ).rejects.toThrow('Custom error');
  });

  describe('Authentication Errors', () => {
    it('should throw unauthorized error when auth is required but not logged in', async () => {
      // 1. Reset mocks
      MockFactory.resetMocks();

      // 2. Setup unauthenticated state
      AuthFactory.setupAuthClient(ctx.authClient, {
        isExpired: false,
      });

      // 3. Execute & Verify
      await expect(
        ctx.apiClient.get<{ data: string }>(
          '/data',
          {},
          {
            authRequirement: AUTH_REQUIREMENT.MUST,
          },
        ),
      ).rejects.toThrow('Authentication required');
    });

    it('should handle 401 errors with token refresh', async () => {
      // 1. Reset mocks (following best practices)
      MockFactory.resetMocks();

      // 2. Setup expired token state using AuthFactory pattern
      const { setToken } = AuthFactory.setupAuthClient(ctx.authClient, {
        isExpired: true,
      });
      await setToken();

      // 3. Setup endpoints using MockFactory patterns
      // First request fails with 401
      MockFactory.setupApiError(
        '/data',
        {
          kind: 'unauthorized',
          message: 'Token expired',
          data: 'token_expired',
        },
        'GET',
      );

      // Token refresh succeeds
      await MockFactory.setupSuccessfulAuth({
        baseUrl: ctx.baseUrl,
        realm: ctx.keycloakRealm,
      });

      // Retry request succeeds
      MockFactory.setupSuccessfulResponse(
        '/data',
        { data: 'test' },
        {
          method: 'get',
        },
      );

      // 4. Execute request
      const result = await ctx.apiClient.get<{ data: string }>(
        '/data',
        {},
        {
          authRequirement: AUTH_REQUIREMENT.MUST,
        },
      );

      // 5. Verify
      expect(result).toEqual({ data: 'test' });
    });

    it('should handle failed token refresh during request', async () => {
      // 1. Reset mocks
      MockFactory.resetMocks();

      // 2. Setup expired token state using AuthFactory pattern
      const { setToken } = AuthFactory.setupAuthClient(ctx.authClient, {
        isExpired: true,
      });
      await setToken();

      // 3. Setup endpoints using MockFactory patterns
      // Initial request fails with 401
      MockFactory.setupApiError(
        '/data',
        {
          kind: 'unauthorized',
          message: 'Token expired',
          data: 'token_expired',
        },
        'GET',
      );

      // Refresh attempt fails
      MockFactory.setupFailedAuth({
        baseUrl: ctx.baseUrl,
        realm: ctx.keycloakRealm,
      });

      // 4. Execute & Verify
      await expect(
        ctx.apiClient.get<{ data: string }>(
          '/data',
          {},
          {
            authRequirement: AUTH_REQUIREMENT.MUST,
          },
        ),
      ).rejects.toThrow('unauthorized');
    });

    it('should proceed without token when auth is preferred but not available', async () => {
      // 1. Reset mocks
      MockFactory.resetMocks();

      // 2. Setup unauthenticated state
      AuthFactory.setupAuthClient(ctx.authClient, {
        isExpired: false,
      });

      // 3. Setup successful response
      MockFactory.setupSuccessfulResponse(
        '/data',
        { data: 'test' },
        {
          method: 'get',
        },
      );

      // 4. Execute & Verify - should proceed without token
      const result = await ctx.apiClient.get<{ data: string }>(
        '/data',
        {},
        {
          authRequirement: AUTH_REQUIREMENT.SHOULD,
        },
      );

      expect(result).toEqual({ data: 'test' });
    });
  });
});
