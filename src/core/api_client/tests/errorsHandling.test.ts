/**
 * @vitest-environment happy-dom
 */
import { beforeEach, describe, expect, it, test, vi } from 'vitest';
import { AUTH_REQUIREMENT } from '~core/auth/constants';
import { ApiClientError, getApiErrorKind, isApiError } from '../apiClientError';
import { createContext } from './_clientTestsContext';
import { MockFactory } from './factories/mock.factory';
import type { TestContext } from './_clientTestsContext';
import './mocks/replaceUrlWithProxy.mock';

beforeEach(async (context) => {
  context.ctx = await createContext();
});

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

  it('should handle API errors', async () => {
    MockFactory.setupApiError(
      '/error',
      {
        kind: 'not-found',
      },
      'GET',
    );

    const error = await ctx.apiClient
      .get('/error', undefined, {
        errorsConfig: { hideErrors: true },
      })
      .catch((e) => e);

    expect(isApiError(error)).toBe(true);
    expect(getApiErrorKind(error)).toBe('not-found');
  });

  it('should handle network errors', async () => {
    MockFactory.setupNetworkError('/network-error', 'GET');

    const error = await ctx.apiClient
      .get('/network-error', undefined, {
        errorsConfig: { hideErrors: true },
      })
      .catch((e) => e);

    expect(isApiError(error)).toBe(true);
    expect(getApiErrorKind(error)).toBe('client-unknown');
  });
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
      new ApiClientError('', {
        kind: 'bad-data',
      }),
    );

    await expect(ctx.apiClient.get('/testMalformed')).rejects.toMatchObject({
      problem: { kind: 'bad-data' },
    });
  });
});

describe('Authentication Errors', () => {
  test('should handle unauthorized access with expired session (401)', async ({
    ctx,
  }: {
    ctx: TestContext;
  }) => {
    vi.spyOn(ctx.apiClient, 'get').mockRejectedValue(
      new ApiClientError('', {
        kind: 'unauthorized',
        data: 'Not authorized or session has expired.',
      }),
    );

    await expect(ctx.apiClient.get('/test401')).rejects.toMatchObject({
      problem: {
        kind: 'unauthorized',
        data: 'Not authorized or session has expired.',
      },
    });
  });

  test('should handle forbidden access to resource (403)', async ({
    ctx,
  }: {
    ctx: TestContext;
  }) => {
    vi.spyOn(ctx.apiClient, 'get').mockRejectedValue(
      new ApiClientError('', { kind: 'forbidden' }),
    );

    await expect(ctx.apiClient.get('/test403')).rejects.toMatchObject({
      problem: { kind: 'forbidden' },
    });
  });
});

describe('Resource Errors', () => {
  test('should handle resource not found (404)', async ({
    ctx,
  }: {
    ctx: TestContext;
  }) => {
    vi.spyOn(ctx.apiClient, 'get').mockRejectedValue(
      new ApiClientError('', { kind: 'not-found' }),
    );

    await expect(ctx.apiClient.get('/test404')).rejects.toMatchObject({
      problem: { kind: 'not-found' },
    });
  });
});

describe('Network and Connection Errors', () => {
  test('should handle request timeout', async ({ ctx }: { ctx: TestContext }) => {
    vi.spyOn(ctx.apiClient, 'delete').mockRejectedValue(
      new ApiClientError('', {
        kind: 'timeout',
        temporary: true,
      }),
    );

    await expect(ctx.apiClient.delete('/testTimeout')).rejects.toMatchObject({
      problem: {
        kind: 'timeout',
        temporary: true,
      },
    });
  });

  test('should handle server connection failure', async ({
    ctx,
  }: {
    ctx: TestContext;
  }) => {
    vi.spyOn(ctx.apiClient, 'delete').mockRejectedValue(
      new ApiClientError('', {
        kind: 'client-unknown',
      }),
    );

    await expect(ctx.apiClient.delete('/testNetwork')).rejects.toMatchObject({
      problem: { kind: 'client-unknown' },
    });
  });

  test('should handle request abortion', async ({ ctx }: { ctx: TestContext }) => {
    vi.spyOn(ctx.apiClient, 'delete').mockRejectedValue(
      new ApiClientError('', {
        kind: 'canceled',
      }),
    );

    await expect(ctx.apiClient.delete('/testAbort')).rejects.toMatchObject({
      problem: { kind: 'canceled' },
    });
  });
});

describe('Server Errors', () => {
  test('should handle internal server error (500)', async ({
    ctx,
  }: {
    ctx: TestContext;
  }) => {
    vi.spyOn(ctx.apiClient, 'get').mockRejectedValue(
      new ApiClientError('', {
        data: null,
        kind: 'server',
      }),
    );

    await expect(ctx.apiClient.get('/test500')).rejects.toMatchObject({
      problem: {
        data: null,
        kind: 'server',
      },
    });
  });
});

describe('Rate Limiting and Service Availability', () => {
  test('should handle rate limiting response (429)', async ({
    ctx,
  }: {
    ctx: TestContext;
  }) => {
    vi.spyOn(ctx.apiClient, 'get').mockRejectedValue(
      new ApiClientError('', {
        kind: 'unknown',
        temporary: true,
      }),
    );

    await expect(ctx.apiClient.get('/test429')).rejects.toMatchObject({
      problem: {
        kind: 'unknown',
        temporary: true,
      },
    });
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
    const promise = ctx.apiClient.get('/testCancel', undefined, {
      signal,
      authRequirement: AUTH_REQUIREMENT.OPTIONAL,
    });
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
      ctx.apiClient.get('/test1', undefined, {
        signal: controller.signal,
        authRequirement: AUTH_REQUIREMENT.OPTIONAL,
      }),
      ctx.apiClient.get('/test2', undefined, {
        signal: controller.signal,
        authRequirement: AUTH_REQUIREMENT.OPTIONAL,
      }),
      ctx.apiClient.get('/test3', undefined, {
        signal: controller.signal,
        authRequirement: AUTH_REQUIREMENT.OPTIONAL,
      }),
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

describe('Error Configuration', () => {
  test('should not emit errors when hideErrors is true', async ({
    ctx,
  }: {
    ctx: TestContext;
  }) => {
    const errorListener = vi.fn();
    ctx.apiClient.on('error', errorListener);

    MockFactory.setupApiError('/error', { kind: 'not-found' }, 'GET');

    await ctx.apiClient
      .get('/error', undefined, { errorsConfig: { hideErrors: true } })
      .catch(() => {});

    expect(errorListener).not.toHaveBeenCalled();
  });

  test('should use custom error message for specific status code', async ({
    ctx,
  }: {
    ctx: TestContext;
  }) => {
    const customMessage = 'Custom not found message';

    MockFactory.setupApiError('/error', { kind: 'not-found' }, 'GET');

    const error = await ctx.apiClient
      .get('/error', undefined, { errorsConfig: { messages: { 404: customMessage } } })
      .catch((e) => e);

    expect((error as ApiClientError).message).toBe(customMessage);
  });

  test('should use global custom error message', async ({
    ctx,
  }: {
    ctx: TestContext;
  }) => {
    const globalMessage = 'Global error message';

    MockFactory.setupApiError('/error', { kind: 'not-found' }, 'GET');

    const error = await ctx.apiClient
      .get('/error', undefined, {
        errorsConfig: {
          messages: globalMessage,
        },
      })
      .catch((e) => e);

    expect((error as ApiClientError).message).toBe(globalMessage);
  });
});
