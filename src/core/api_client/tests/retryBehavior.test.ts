/**
 * @vitest-environment happy-dom
 */
import { test, expect, beforeEach, vi, describe } from 'vitest';
import { AUTH_REQUIREMENT } from '~core/auth/constants';
import { ApiClientError } from '../apiClientError';
import { createContext } from './_clientTestsContext';
import { MockFactory } from './factories/mock.factory';
import type { TestContext } from './_clientTestsContext';

beforeEach(async (context) => {
  context.ctx = await createContext();
});

describe('Retry Behavior', () => {
  test('should retry only on timeout by default', async ({
    ctx,
  }: {
    ctx: TestContext;
  }) => {
    // Reset default mocks
    MockFactory.resetMocks();

    // First call throws timeout, second call succeeds
    MockFactory.setupSequentialResponses(
      '/test',
      [
        new ApiClientError('Request Timeout', {
          kind: 'timeout',
          temporary: true,
        }),
        { status: 200, body: { data: 'success' } },
      ],
      'GET',
    );

    const result = await ctx.apiClient.get('/test', undefined, {
      retry: { attempts: 1 },
      authRequirement: AUTH_REQUIREMENT.OPTIONAL,
    });

    expect(result).toEqual({ data: 'success' });
    expect(MockFactory.getCallCount()).toBe(2);
  });

  test('should not retry on non-timeout errors by default', async ({
    ctx,
  }: {
    ctx: TestContext;
  }) => {
    // Reset default mocks
    MockFactory.resetMocks();

    // Setup server error
    MockFactory.setupApiError(
      '/test',
      {
        kind: 'server',
        message: 'Server Error',
        data: null,
      },
      'GET',
    );

    await expect(
      ctx.apiClient.get('/test', undefined, {
        retry: { attempts: 3 },
        authRequirement: AUTH_REQUIREMENT.OPTIONAL,
      }),
    ).rejects.toMatchObject({
      problem: { kind: 'server' },
    });

    expect(MockFactory.getCallCount()).toBe(1);
  });

  test('should retry on specified error kinds', async ({ ctx }: { ctx: TestContext }) => {
    // Reset default mocks
    MockFactory.resetMocks();

    // First throws server error, second succeeds
    MockFactory.setupSequentialResponses(
      '/test',
      [
        new ApiClientError('Server Error', {
          kind: 'server',
          data: null,
        }),
        { status: 200, body: { data: 'success' } },
      ],
      'GET',
    );

    const result = await ctx.apiClient.get('/test', undefined, {
      retry: {
        attempts: 1,
        onErrorKinds: ['server', 'timeout'],
      },
      authRequirement: AUTH_REQUIREMENT.OPTIONAL,
    });

    expect(result).toEqual({ data: 'success' });
    expect(MockFactory.getCallCount()).toBe(2);
  });

  test('should respect retry attempts limit', async ({ ctx }: { ctx: TestContext }) => {
    // Reset default mocks
    MockFactory.resetMocks();

    // Setup three sequential timeout errors
    MockFactory.setupSequentialResponses(
      '/test',
      [
        new ApiClientError('Request Timeout', {
          kind: 'timeout',
          temporary: true,
        }),
        new ApiClientError('Request Timeout', {
          kind: 'timeout',
          temporary: true,
        }),
        new ApiClientError('Request Timeout', {
          kind: 'timeout',
          temporary: true,
        }),
      ],
      'GET',
    );

    await expect(
      ctx.apiClient.get('/test', undefined, {
        retry: { attempts: 2 },
        authRequirement: AUTH_REQUIREMENT.OPTIONAL,
      }),
    ).rejects.toMatchObject({
      problem: { kind: 'timeout' },
    });

    // Verify all three requests were made (initial + 2 retries)
    expect(MockFactory.getCallCount()).toBe(3);
  });

  test('should respect delay between retries', async ({ ctx }: { ctx: TestContext }) => {
    // Reset default mocks
    MockFactory.resetMocks();

    // Setup sequential responses to verify delay
    MockFactory.setupSequentialResponses(
      '/test',
      [
        new ApiClientError('Request Timeout', {
          kind: 'timeout',
          temporary: true,
        }),
        { status: 200, body: { data: 'success' } },
      ],
      'GET',
    );

    // Use try-finally to ensure cleanup
    try {
      vi.useFakeTimers();

      const requestPromise = ctx.apiClient.get('/test', undefined, {
        retry: {
          attempts: 1,
          delayMs: 1000,
        },
        authRequirement: AUTH_REQUIREMENT.OPTIONAL,
      });

      // First request should happen immediately
      expect(MockFactory.getCallCount()).toBe(1);

      // Advance timer by the full delay
      await vi.advanceTimersByTimeAsync(1000);

      // Wait for the promise to resolve
      const result = await requestPromise;

      // Verify the result and call count
      expect(result).toEqual({ data: 'success' });
      expect(MockFactory.getCallCount()).toBe(2);
    } finally {
      vi.useRealTimers();
    }
  });

  test('should use default retry configuration', async ({
    ctx,
  }: {
    ctx: TestContext;
  }) => {
    // Reset default mocks
    MockFactory.resetMocks();

    // First call throws timeout, second succeeds
    MockFactory.setupSequentialResponses(
      '/test',
      [
        new ApiClientError('Request Timeout', {
          kind: 'timeout',
          temporary: true,
        }),
        { status: 200, body: { data: 'success' } },
      ],
      'GET',
    );

    const result = await ctx.apiClient.get('/test', undefined, {
      retry: { attempts: 1 }, // Only specify attempts, rest should use defaults
      authRequirement: AUTH_REQUIREMENT.OPTIONAL,
    });

    expect(result).toEqual({ data: 'success' });
    expect(MockFactory.getCallCount()).toBe(2);
  });

  test('should handle errors during retries', async ({ ctx }: { ctx: TestContext }) => {
    // Reset default mocks
    MockFactory.resetMocks();

    // First timeout, then server error
    MockFactory.setupSequentialResponses(
      '/test',
      [
        new ApiClientError('Request Timeout', {
          kind: 'timeout',
          temporary: true,
        }),
        new ApiClientError('Server Error', {
          kind: 'server',
          data: null,
        }),
      ],
      'GET',
    );

    await expect(
      ctx.apiClient.get('/test', undefined, {
        retry: { attempts: 2 },
        authRequirement: AUTH_REQUIREMENT.OPTIONAL,
      }),
    ).rejects.toMatchObject({
      problem: { kind: 'server' },
    });

    expect(MockFactory.getCallCount()).toBe(2);
  });
});
