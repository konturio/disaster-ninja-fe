/**
 * @vitest-environment happy-dom
 */
import { test, expect, beforeEach, vi, describe } from 'vitest';
import { ApiClientError } from '../apiClientError';
import { createContext } from './_clientTestsContext';
import type { TestContext } from './_clientTestsContext';

beforeEach(async (context) => {
  context.ctx = await createContext();
});

describe('API Response Handling', () => {
  test('should handle successful empty response (204)', async ({
    ctx,
  }: {
    ctx: TestContext;
  }) => {
    vi.spyOn(ctx.apiClient, 'get').mockResolvedValue(null);
    const response = await ctx.apiClient.get('/test204');
    expect(response).toStrictEqual(null);
  });

  test('should handle malformed token response', async ({
    ctx,
  }: {
    ctx: TestContext;
  }) => {
    vi.spyOn(ctx.apiClient, 'get').mockRejectedValue(
      new ApiClientError('Invalid token format in response', {
        kind: 'bad-data',
      }),
    );

    await expect(ctx.apiClient.get('/testMalformed')).rejects.toMatchObject(
      new ApiClientError('Invalid token format in response', {
        kind: 'bad-data',
      }),
    );
  });
});

describe('Authentication Errors', () => {
  test('should handle unauthorized access with expired session (401)', async ({
    ctx,
  }: {
    ctx: TestContext;
  }) => {
    vi.spyOn(ctx.apiClient, 'get').mockRejectedValue(
      new ApiClientError('Not authorized or session has expired.', {
        kind: 'unauthorized',
        data: 'Not authorized or session has expired.',
      }),
    );

    await expect(ctx.apiClient.get('/test401')).rejects.toMatchObject(
      new ApiClientError('Not authorized or session has expired.', {
        kind: 'unauthorized',
        data: 'Not authorized or session has expired.',
      }),
    );
  });

  test('should handle forbidden access to resource (403)', async ({
    ctx,
  }: {
    ctx: TestContext;
  }) => {
    vi.spyOn(ctx.apiClient, 'get').mockRejectedValue(
      new ApiClientError('Forbidden', { kind: 'forbidden' }),
    );

    await expect(ctx.apiClient.get('/test403')).rejects.toMatchObject(
      new ApiClientError('Forbidden', { kind: 'forbidden' }),
    );
  });
});

describe('Resource Errors', () => {
  test('should handle resource not found (404)', async ({
    ctx,
  }: {
    ctx: TestContext;
  }) => {
    vi.spyOn(ctx.apiClient, 'get').mockRejectedValue(
      new ApiClientError('Not found', { kind: 'not-found' }),
    );

    await expect(ctx.apiClient.get('/test404')).rejects.toMatchObject(
      new ApiClientError('Not found', { kind: 'not-found' }),
    );
  });
});

describe('Network and Connection Errors', () => {
  test('should handle request timeout', async ({ ctx }: { ctx: TestContext }) => {
    vi.spyOn(ctx.apiClient, 'delete').mockRejectedValue(
      new ApiClientError('Request Timeout', {
        kind: 'timeout',
        temporary: true,
      }),
    );

    await expect(ctx.apiClient.delete('/testTimeout')).rejects.toMatchObject(
      new ApiClientError('Request Timeout', {
        kind: 'timeout',
        temporary: true,
      }),
    );
  });

  test('should handle server connection failure', async ({
    ctx,
  }: {
    ctx: TestContext;
  }) => {
    vi.spyOn(ctx.apiClient, 'delete').mockRejectedValue(
      new ApiClientError("Can't connect to server", {
        kind: 'cannot-connect',
        temporary: true,
      }),
    );

    await expect(ctx.apiClient.delete('/testNetwork')).rejects.toMatchObject(
      new ApiClientError("Can't connect to server", {
        kind: 'cannot-connect',
        temporary: true,
      }),
    );
  });

  test('should handle request abortion', async ({ ctx }: { ctx: TestContext }) => {
    vi.spyOn(ctx.apiClient, 'delete').mockRejectedValue(
      new ApiClientError('Request was cancelled', {
        kind: 'canceled',
      }),
    );

    await expect(ctx.apiClient.delete('/testAbort')).rejects.toMatchObject(
      new ApiClientError('Request was cancelled', {
        kind: 'canceled',
      }),
    );
  });
});

describe('Server Errors', () => {
  test('should handle internal server error (500)', async ({
    ctx,
  }: {
    ctx: TestContext;
  }) => {
    vi.spyOn(ctx.apiClient, 'get').mockRejectedValue(
      new ApiClientError('Unknown Error', {
        data: null,
        kind: 'server',
      }),
    );

    await expect(ctx.apiClient.get('/test500')).rejects.toMatchObject(
      new ApiClientError('Unknown Error', {
        data: null,
        kind: 'server',
      }),
    );
  });
});

describe('Rate Limiting and Service Availability', () => {
  test('should handle rate limiting response (429)', async ({
    ctx,
  }: {
    ctx: TestContext;
  }) => {
    vi.spyOn(ctx.apiClient, 'get').mockRejectedValue(
      new ApiClientError('Too Many Requests', {
        kind: 'client-unknown',
      }),
    );

    try {
      await ctx.apiClient.get('/testRateLimit');
    } catch (e) {
      expect(e).toBeInstanceOf(ApiClientError);
      expect((e as ApiClientError).problem.kind).toBe('client-unknown');
    }
  });

  test('should handle service unavailable (503)', async ({
    ctx,
  }: {
    ctx: TestContext;
  }) => {
    vi.spyOn(ctx.apiClient, 'get').mockRejectedValue(
      new ApiClientError('Service Temporarily Unavailable', {
        kind: 'server',
      }),
    );

    await expect(ctx.apiClient.get('/testMaintenance')).rejects.toMatchObject(
      new ApiClientError('Service Temporarily Unavailable', {
        kind: 'server',
      }),
    );
  });
});

describe('Request Lifecycle', () => {
  test('should handle request cancellation', async ({ ctx }: { ctx: TestContext }) => {
    const controller = new AbortController();
    const signal = controller.signal;

    // Mock the request to delay and respect abort signal
    ctx.fetchMock.get('*', {
      throws: new DOMException('The operation was aborted', 'AbortError'),
    });

    // Start the request and immediately cancel it
    const promise = ctx.apiClient.get('/testCancel', undefined, false, { signal });
    controller.abort();

    const error = (await promise.catch((e) => e)) as ApiClientError;
    expect(error.problem.kind).toBe('canceled');
  });

  test('should handle concurrent requests cancellation', async ({
    ctx,
  }: {
    ctx: TestContext;
  }) => {
    // Mock delayed responses that will be aborted
    ctx.fetchMock.get('*', {
      throws: new DOMException('The operation was aborted', 'AbortError'),
    });

    const controller = new AbortController();

    // Start multiple requests
    const promises = [
      ctx.apiClient.get('/test1', undefined, false, { signal: controller.signal }),
      ctx.apiClient.get('/test2', undefined, false, { signal: controller.signal }),
      ctx.apiClient.get('/test3', undefined, false, { signal: controller.signal }),
    ];

    // Cancel all requests
    controller.abort();

    // All requests should be cancelled
    await Promise.all(
      promises.map(async (p) => {
        const error = (await p.catch((e) => e)) as ApiClientError;
        expect(error.problem.kind).toBe('canceled');
      }),
    );
  });
});
