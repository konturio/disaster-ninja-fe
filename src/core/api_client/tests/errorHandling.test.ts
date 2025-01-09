import { describe, it, expect, beforeEach } from 'vitest';
import './mocks/replaceUrlWithProxy.mock';
import { AUTH_REQUIREMENT } from '~core/auth/constants';
import { createContext } from './_clientTestsContext';
import { MockFactory } from './factories/mock.factory';
import type { TestContext } from './_clientTestsContext';

describe('ApiClient Error Handling', () => {
  let context: TestContext;

  beforeEach(async () => {
    context = await createContext();
    MockFactory.resetMocks();
    await MockFactory.setupSuccessfulAuth();
    MockFactory.setupOidcConfiguration();
  });

  it('should handle server errors with custom messages', async () => {
    MockFactory.setupApiError(
      '/data',
      {
        kind: 'bad-data',
        message: 'Custom error message',
      },
      'GET',
    );

    await expect(
      context.apiClient.get('/data', undefined, {
        errorsConfig: {
          messages: {
            422: 'Validation failed',
          },
        },
        authRequirement: AUTH_REQUIREMENT.OPTIONAL,
      }),
    ).rejects.toThrow('Validation failed');
  });

  it('should handle network errors', async () => {
    MockFactory.setupNetworkError('/data');
    await expect(
      context.apiClient.get('/data', undefined, {
        authRequirement: AUTH_REQUIREMENT.OPTIONAL,
      }),
    ).rejects.toThrow("Can't connect to server");
  });

  it('should handle timeout errors', async () => {
    MockFactory.setupTimeoutError('/data', 'GET');
    await expect(
      context.apiClient.get('/data', undefined, {
        authRequirement: AUTH_REQUIREMENT.OPTIONAL,
      }),
    ).rejects.toThrow('Request Timeout');
  });

  it('should suppress error events when hideErrors is true', async () => {
    const errorEvents: any[] = [];
    context.apiClient.on('error', (error) => {
      errorEvents.push(error);
    });

    MockFactory.setupApiError(
      '/data',
      {
        kind: 'bad-data',
        message: 'Error message',
      },
      'GET',
    );

    await expect(
      context.apiClient.get('/data', undefined, {
        errorsConfig: {
          hideErrors: true,
        },
        authRequirement: AUTH_REQUIREMENT.OPTIONAL,
      }),
    ).rejects.toThrow();

    expect(errorEvents.length).toBe(0);
  });

  it('should emit error events by default', async () => {
    const errorEvents: any[] = [];
    context.apiClient.on('error', (error) => {
      errorEvents.push(error);
    });

    MockFactory.setupApiError(
      '/data',
      {
        kind: 'bad-data',
        message: 'bad-data',
      },
      'GET',
    );

    await expect(
      context.apiClient.get('/data', undefined, {
        authRequirement: AUTH_REQUIREMENT.OPTIONAL,
      }),
    ).rejects.toThrow();

    expect(errorEvents.length).toBe(1);
    expect(errorEvents[0].problem.kind).toBe('unknown');
  });

  it('should handle string error messages', async () => {
    MockFactory.setupApiError(
      '/data',
      {
        kind: 'bad-data',
        message: 'Error message',
      },
      'GET',
    );

    await expect(
      context.apiClient.get('/data', undefined, {
        errorsConfig: {
          messages: 'Custom error',
        },
        authRequirement: AUTH_REQUIREMENT.OPTIONAL,
      }),
    ).rejects.toThrow('Custom error');
  });

  describe('Authentication Errors', () => {
    it('should throw unauthorized error when auth is required but not logged in', async () => {
      await expect(
        context.apiClient.get('/data', undefined, {
          authRequirement: AUTH_REQUIREMENT.MUST,
        }),
      ).rejects.toThrow('Authentication required');
    });

    it('should handle 401 errors with token refresh', async () => {
      await context.authClient.login(context.username, context.password);

      // Setup initial request to fail with 401
      MockFactory.setupApiError(
        '/data',
        {
          kind: 'unauthorized',
          message: 'Token expired',
          data: 'token_expired',
        },
        'GET',
      );

      // Setup successful refresh
      await MockFactory.setupSuccessfulAuth();

      // Setup retry request to succeed
      MockFactory.setupSuccessfulResponse('/data', { data: 'test' });

      const result = await context.apiClient.get('/data', undefined, {
        authRequirement: AUTH_REQUIREMENT.MUST,
      });

      expect(result).toEqual({ data: 'test' });
    });

    it('should handle failed token refresh during request', async () => {
      await context.authClient.login(context.username, context.password);

      // Setup initial request to fail with 401
      MockFactory.setupApiError(
        '/data',
        {
          kind: 'unauthorized',
          message: 'Token expired',
          data: 'token_expired',
        },
        'GET',
      );

      // Setup refresh to fail
      MockFactory.setupFailedAuth();

      await expect(
        context.apiClient.get('/data', undefined, {
          authRequirement: AUTH_REQUIREMENT.MUST,
        }),
      ).rejects.toThrow('Invalid credentials');
    });
  });
});
