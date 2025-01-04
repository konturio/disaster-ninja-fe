import { describe, it, expect, beforeEach } from 'vitest';
import './mocks/replaceUrlWithProxy.mock';
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
      context.apiClient.get('/data', undefined, false, {
        errorsConfig: {
          messages: {
            422: 'Validation failed',
          },
        },
      }),
    ).rejects.toThrow('Validation failed');
  });

  it('should handle network errors', async () => {
    MockFactory.setupNetworkError('/data');
    await expect(context.apiClient.get('/data', undefined, false)).rejects.toThrow(
      "Can't connect to server",
    );
  });

  it('should handle timeout errors', async () => {
    MockFactory.setupTimeoutError('/data', 'GET');
    await expect(context.apiClient.get('/data', undefined, false)).rejects.toThrow(
      'Request Timeout',
    );
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
      context.apiClient.get('/data', undefined, false, {
        errorsConfig: {
          hideErrors: true,
        },
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

    await expect(context.apiClient.get('/data', undefined, false)).rejects.toThrow();

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
      context.apiClient.get('/data', undefined, false, {
        errorsConfig: {
          messages: 'Custom error',
        },
      }),
    ).rejects.toThrow('Custom error');
  });
});
