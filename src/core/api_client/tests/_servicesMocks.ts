import type { I18n, NotificationService } from '../../types';
import type { NotificationMessage } from '~core/types/notification';

export const createNotificationServiceMock = () =>
  ({
    error: (message: NotificationMessage) => {
      /* noop */
    },
  } as NotificationService);

export const createTranslationServiceMock = () =>
  ({
    t: (message: string) => message,
  } as I18n);
