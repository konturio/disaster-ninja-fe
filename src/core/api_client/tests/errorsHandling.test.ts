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
      new ApiClientError('Request Timeout', {
        kind: 'timeout',
        temporary: true,
      }),
    );

    await expect(ctx.apiClient.delete('/testAbort')).rejects.toMatchObject(
      new ApiClientError('Request Timeout', {
        kind: 'timeout',
        temporary: true,
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
