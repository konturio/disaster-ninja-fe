/**
 * @vitest-environment happy-dom
 */
import { test, expect, beforeEach, vi, describe } from 'vitest';
import { AUTH_REQUIREMENT } from '~core/auth/constants';
import * as waitModule from '~utils/test/wait';
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

    // Mock the wait function
    const waitSpy = vi
      .spyOn(waitModule, 'wait')
      .mockImplementation(() => Promise.resolve());

    try {
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
        retry: { attempts: 1, delayMs: 100 }, // Use shorter delay for testing
        authRequirement: AUTH_REQUIREMENT.OPTIONAL,
      });

      expect(result).toEqual({ data: 'success' });
      expect(MockFactory.getCallCount()).toBe(2);
      expect(waitSpy).toHaveBeenCalledWith(0.1); // 100ms = 0.1s
    } finally {
      waitSpy.mockRestore();
    }
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

    // Mock the wait function
    const waitSpy = vi
      .spyOn(waitModule, 'wait')
      .mockImplementation(() => Promise.resolve());

    try {
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
          delayMs: 100,
          onErrorKinds: ['server', 'timeout'],
        },
        authRequirement: AUTH_REQUIREMENT.OPTIONAL,
      });

      expect(result).toEqual({ data: 'success' });
      expect(MockFactory.getCallCount()).toBe(2);
      expect(waitSpy).toHaveBeenCalledWith(0.1); // 100ms = 0.1s
    } finally {
      waitSpy.mockRestore();
    }
  });

  test('should respect retry attempts limit', async ({ ctx }: { ctx: TestContext }) => {
    // Reset default mocks
    MockFactory.resetMocks();

    // Mock the wait function
    const waitSpy = vi
      .spyOn(waitModule, 'wait')
      .mockImplementation(() => Promise.resolve());

    try {
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
          retry: { attempts: 2, delayMs: 100 },
          authRequirement: AUTH_REQUIREMENT.OPTIONAL,
        }),
      ).rejects.toMatchObject({
        problem: { kind: 'timeout' },
      });

      // Verify all three requests were made (initial + 2 retries)
      expect(MockFactory.getCallCount()).toBe(3);
      expect(waitSpy).toHaveBeenCalledTimes(2);
      expect(waitSpy).toHaveBeenCalledWith(0.1); // 100ms = 0.1s
    } finally {
      waitSpy.mockRestore();
    }
  });

  test('should respect delay between retries', async ({ ctx }: { ctx: TestContext }) => {
    // Reset default mocks
    MockFactory.resetMocks();

    // Mock the wait function
    const waitSpy = vi
      .spyOn(waitModule, 'wait')
      .mockImplementation(() => Promise.resolve());

    try {
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

      const result = await ctx.apiClient.get('/test', undefined, {
        retry: {
          attempts: 1,
          delayMs: 100,
        },
        authRequirement: AUTH_REQUIREMENT.OPTIONAL,
      });

      // Verify the result and call count
      expect(result).toEqual({ data: 'success' });
      expect(MockFactory.getCallCount()).toBe(2);
      expect(waitSpy).toHaveBeenCalledWith(0.1); // 100ms = 0.1s
    } finally {
      waitSpy.mockRestore();
    }
  });

  test('should use default retry configuration', async ({
    ctx,
  }: {
    ctx: TestContext;
  }) => {
    // Reset default mocks
    MockFactory.resetMocks();

    // Mock the wait function
    const waitSpy = vi
      .spyOn(waitModule, 'wait')
      .mockImplementation(() => Promise.resolve());

    try {
      // Setup sequential responses
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

      // Verify the result and call count
      expect(result).toEqual({ data: 'success' });
      expect(MockFactory.getCallCount()).toBe(2);
      expect(waitSpy).toHaveBeenCalledWith(1); // Default delay is 1000ms = 1s
    } finally {
      waitSpy.mockRestore();
    }
  });

  test('should handle errors during retries', async ({ ctx }: { ctx: TestContext }) => {
    // Reset default mocks
    MockFactory.resetMocks();

    // Mock the wait function
    const waitSpy = vi
      .spyOn(waitModule, 'wait')
      .mockImplementation(() => Promise.resolve());

    try {
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
          retry: { attempts: 2, delayMs: 100 },
          authRequirement: AUTH_REQUIREMENT.OPTIONAL,
        }),
      ).rejects.toMatchObject({
        problem: { kind: 'server' },
      });

      expect(MockFactory.getCallCount()).toBe(2);
      expect(waitSpy).toHaveBeenCalledWith(0.1); // 100ms = 0.1s
    } finally {
      waitSpy.mockRestore();
    }
  });
});
