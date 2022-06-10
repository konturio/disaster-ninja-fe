/**
 * @vitest-environment happy-dom
 */
import { test, expect, beforeEach } from 'vitest';
import sinon from 'sinon';
import { ApiClientError } from '../apiClientError';
import { createContext } from './_clientTestsContext';

beforeEach((context) => {
  context.ctx = createContext();
});

test('401 error', async ({ ctx }) => {
  const loginRequestMock = sinon.fake.returns([401]);
  ctx.mockAdapter.onGet('test401').reply(loginRequestMock);

  await expect(ctx.apiClient.get('/test401')).rejects.toMatchObject(
    new ApiClientError('Not authorized or session has expired.', {
      kind: 'unauthorized',
      data: 'Not authorized or session has expired.',
    }),
  );
});

test('403 error', async ({ ctx }) => {
  const loginRequestMock = sinon.fake.returns([403]);
  ctx.mockAdapter.onGet('test403').reply(loginRequestMock);

  await expect(ctx.apiClient.get('/test403')).rejects.toMatchObject(
    new ApiClientError('Forbidden', { kind: 'forbidden' }),
  );
});

test('404 error', async ({ ctx }) => {
  const loginRequestMock = sinon.fake.returns([404]);
  ctx.mockAdapter.onGet('test404').reply(loginRequestMock);

  await expect(ctx.apiClient.get('/test404')).rejects.toMatchObject(
    new ApiClientError('Not found', { kind: 'not-found' }),
  );
});

test('timeout error', async ({ ctx }) => {
  ctx.mockAdapter.onDelete('testTimeout').timeout();

  await expect(ctx.apiClient.delete('/testTimeout')).rejects.toMatchObject(
    new ApiClientError('Request Timeout', {
      kind: 'timeout',
      temporary: true,
    }),
  );
});

test('network error', async ({ ctx }) => {
  ctx.mockAdapter.onDelete('testNetwork').networkError();

  await expect(ctx.apiClient.delete('/testNetwork')).rejects.toMatchObject(
    new ApiClientError("Can't connect to server", {
      kind: 'cannot-connect',
      temporary: true,
    }),
  );
});

test('request abort error', async ({ ctx }) => {
  ctx.mockAdapter.onDelete('testAbort').abortRequest();

  await expect(ctx.apiClient.delete('/testAbort')).rejects.toMatchObject(
    new ApiClientError('Request Timeout', {
      kind: 'timeout',
      temporary: true,
    }),
  );
});

test('500 error', async ({ ctx }) => {
  const loginRequestMock = sinon.fake.returns([500]);
  ctx.mockAdapter.onGet('test500').reply(loginRequestMock);

  await expect(ctx.apiClient.get('/test500')).rejects.toMatchObject(
    new ApiClientError('Unknown Error', {
      data: null,
      kind: 'server',
    }),
  );
});
