import MockAdapter from 'axios-mock-adapter';
import sinon from 'sinon';
import {
  createLocalStorageMock,
  setupTestContext,
} from '~utils/test_utils/setupTest';
import { ApiClient } from '../apiClient';
import { ApiClientError } from '../apiClientError';
import type { NotificationMessage } from '~core/types/notification';
import type { INotificationService, ITranslationService } from '../types';

/* Setup stage */
let n = 0;
const test = setupTestContext(() => {
  const localStorageMock = createLocalStorageMock();
  const instanceId = `Instance ${n++}`;
  const token =
    'eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiYWRtaW4iLCJVc2VybmFtZSI6InRlc3R1c2VyIiwiZXhwIjoxNjk3MTA2NDM0LCJpYXQiOjE2MzQwMzQ0MzR9.0GUrGfXYioalJVDRfWgWfx3oQRwk9FsOeAvULj-3ins';
  const expiredToken =
    'eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiYWRtaW4iLCJVc2VybmFtZSI6InRlc3R1c2VyIiwiZXhwIjoxNjAyNDk4NDM0LCJpYXQiOjE2MzQwMzQ0MzR9.tIETTaRaiJYto0Wb4oPbfCJHUGGjw9--mTfXVWWsVMk';

  ApiClient.init({
    notificationService: {
      error: (message: NotificationMessage) => {
        /* noop */
      },
    } as INotificationService,
    translationService: {
      t: (message: string) => message,
    } as ITranslationService,
    loginApiPath: '/login',
    refreshTokenApiPath: '/refresh',
    baseURL: 'https://localhost/api',
    timeout: 3000,
    storage: localStorageMock,
    instanceId,
  });

  const apiClient = ApiClient.getInstance(instanceId);
  // trick to get access to private var
  const axiosInstance = (apiClient as any).apiSauceInstance.axiosInstance;

  // setup token expiration time
  (apiClient as any).token = token;
  (apiClient as any).tokenWillExpire = new Date(
    new Date().getTime() + 1000 * 60 * 30,
  );

  return {
    apiClient,
    token,
    expiredToken,
    mockAdapter: new MockAdapter(axiosInstance),
  };
});

test('401 error', async (t) => {
  const loginRequestMock = sinon.fake.returns([401]);
  t.context.mockAdapter.onGet('test401').reply(loginRequestMock);

  const error = await t.throwsAsync(t.context.apiClient.get('/test401'), {
    instanceOf: ApiClientError,
    message: 'Not authorized or session has expired.',
  });

  t.deepEqual(
    new ApiClientError('Not authorized or session has expired.', {
      kind: 'unauthorized',
      data: 'Not authorized or session has expired.',
    }),
    error,
  );
});

test('403 error', async (t) => {
  const loginRequestMock = sinon.fake.returns([403]);
  t.context.mockAdapter.onGet('test403').reply(loginRequestMock);

  const error = await t.throwsAsync(t.context.apiClient.get('/test403'), {
    instanceOf: ApiClientError,
    message: 'Forbidden',
  });

  t.deepEqual(new ApiClientError('Forbidden', { kind: 'forbidden' }), error);
});

test('404 error', async (t) => {
  const loginRequestMock = sinon.fake.returns([404]);
  t.context.mockAdapter.onGet('test404').reply(loginRequestMock);

  const error = await t.throwsAsync(t.context.apiClient.get('/test404'), {
    instanceOf: ApiClientError,
    message: 'Not found',
  });

  t.deepEqual(new ApiClientError('Not found', { kind: 'not-found' }), error);
});

test('timeout error', async (t) => {
  t.context.mockAdapter.onDelete('testTimeout').timeout();

  const error = await t.throwsAsync(
    t.context.apiClient.delete('/testTimeout'),
    {
      instanceOf: ApiClientError,
    },
  );

  t.deepEqual(
    new ApiClientError('Request Timeout', {
      kind: 'timeout',
      temporary: true,
    }),
    error,
  );
});

test('network error', async (t) => {
  t.context.mockAdapter.onDelete('testNetwork').networkError();

  const error = await t.throwsAsync(
    t.context.apiClient.delete('/testNetwork'),
    {
      instanceOf: ApiClientError,
    },
  );

  t.deepEqual(
    new ApiClientError("Can't connect to server", {
      kind: 'cannot-connect',
      temporary: true,
    }),
    error,
  );
});

test('request abort error', async (t) => {
  t.plan(2);
  t.context.mockAdapter.onDelete('testAbort').abortRequest();

  const error = await t.throwsAsync(t.context.apiClient.delete('/testAbort'), {
    instanceOf: ApiClientError,
  });

  t.deepEqual(
    new ApiClientError('Request Timeout', {
      kind: 'timeout',
      temporary: true,
    }),
    error,
  );
});

test('500 error', async (t) => {
  const loginRequestMock = sinon.fake.returns([500]);
  t.context.mockAdapter.onGet('test500').reply(loginRequestMock);

  const error = await t.throwsAsync(t.context.apiClient.get('/test500'), {
    instanceOf: ApiClientError,
  });

  t.deepEqual(
    new ApiClientError('Unknown Error', {
      data: null,
      kind: 'server',
    }),
    error,
  );
});
