/**
 * @vitest-environment happy-dom
 */
import { test, expect, beforeEach, vi, describe } from 'vitest';
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

    const result = await ctx.apiClient.get('/test', undefined, false, {
      retry: { attempts: 1 },
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
      ctx.apiClient.get('/test', undefined, false, {
        retry: { attempts: 3 },
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

    const result = await ctx.apiClient.get('/test', undefined, false, {
      retry: {
        attempts: 1,
        onErrorKinds: ['server', 'timeout'],
      },
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
      ctx.apiClient.get('/test', undefined, false, {
        retry: { attempts: 2 },
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
        new ApiClientError('Request Timeout', {
          kind: 'timeout',
          temporary: true,
        }),
      ],
      'GET',
    );

    // Use try-finally to ensure cleanup
    try {
      vi.useFakeTimers();

      const promise = ctx.apiClient.get('/test', undefined, false, {
        retry: {
          attempts: 1,
          delayMs: 1000,
        },
      });

      // First request should happen immediately
      expect(MockFactory.getCallCount()).toBe(1);

      // Advance timer by half the delay - nothing should happen
      await vi.advanceTimersByTimeAsync(500);
      expect(MockFactory.getCallCount()).toBe(1);

      // Advance timer to complete the delay
      await vi.advanceTimersByTimeAsync(500);

      // Wait for the promise to reject
      await expect(promise).rejects.toMatchObject({
        problem: { kind: 'timeout' },
      });

      // Second request should have been made
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

    const result = await ctx.apiClient.get('/test', undefined, false, {
      retry: { attempts: 1 }, // Only specify attempts, rest should use defaults
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
      ctx.apiClient.get('/test', undefined, false, {
        retry: { attempts: 2 },
      }),
    ).rejects.toMatchObject({
      problem: { kind: 'server' },
    });

    expect(MockFactory.getCallCount()).toBe(2);
  });
});
