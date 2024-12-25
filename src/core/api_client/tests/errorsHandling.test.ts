/**
 * @vitest-environment happy-dom
 */
import { test, expect, beforeEach, vi } from 'vitest';
import { ApiClientError } from '../apiClientError';
import { createContext } from './_clientTestsContext';
import type { TestContext } from './_clientTestsContext';

beforeEach(async (context) => {
  context.ctx = await createContext();
});

test('204 response', async ({ ctx }: { ctx: TestContext }) => {
  vi.spyOn(ctx.apiClient, 'get').mockResolvedValue(null);

  const response = await ctx.apiClient.get('/test204');
  expect(response).toStrictEqual(null);
});

test('401 error', async ({ ctx }: { ctx: TestContext }) => {
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

test('403 error', async ({ ctx }: { ctx: TestContext }) => {
  vi.spyOn(ctx.apiClient, 'get').mockRejectedValue(
    new ApiClientError('Forbidden', { kind: 'forbidden' }),
  );

  await expect(ctx.apiClient.get('/test403')).rejects.toMatchObject(
    new ApiClientError('Forbidden', { kind: 'forbidden' }),
  );
});

test('404 error', async ({ ctx }: { ctx: TestContext }) => {
  vi.spyOn(ctx.apiClient, 'get').mockRejectedValue(
    new ApiClientError('Not found', { kind: 'not-found' }),
  );

  await expect(ctx.apiClient.get('/test404')).rejects.toMatchObject(
    new ApiClientError('Not found', { kind: 'not-found' }),
  );
});

test('timeout error', async ({ ctx }: { ctx: TestContext }) => {
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

test('network error', async ({ ctx }: { ctx: TestContext }) => {
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

test('request abort error', async ({ ctx }: { ctx: TestContext }) => {
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

test('500 error', async ({ ctx }: { ctx: TestContext }) => {
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
