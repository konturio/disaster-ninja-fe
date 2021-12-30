import { ApiClient, INotificationService, ITranslationService } from '../ApiClient';
import { NotificationMessage } from '../../../core/types/notification';
import { createLocalStorageMock, setupTestContext } from '../../../utils/testsUtils/setupTest';

/* Setup stage */
const test = setupTestContext({
  baseURL: 'https://localhost/api',
  loginApiPath: '/login',
  refreshTokenApiPath: '/refresh',
  timeout: 3000,
  notificationService: {
    error: (message: NotificationMessage) => {
      /* noop */
    },
  } as INotificationService,
  translationService: {
    t: (message: string) => message,
  } as ITranslationService,
});

/* Test cases */

test('has to be initialized first', (t) => {
  const error = t.throws(ApiClient.getInstance);
  t.is(error.message, 'You have to initialize api client first!');
});

test('can be initialized with config object', (t) => {
  ApiClient.init({
    notificationService: t.context.notificationService,
    translationService: t.context.translationService,
    loginApiPath: t.context.loginApiPath,
    baseURL: t.context.baseURL,
    timeout: t.context.timeout,
    storage: createLocalStorageMock(),
  });
  t.truthy(ApiClient.getInstance());
});
