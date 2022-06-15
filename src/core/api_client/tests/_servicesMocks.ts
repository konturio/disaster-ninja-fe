import type { INotificationService, ITranslationService } from '../types';
import type { NotificationMessage } from '~core/types/notification';

export const createNotificationServiceMock = () =>
  ({
    error: (message: NotificationMessage) => {
      /* noop */
    },
  } as INotificationService);

export const createTranslationServiceMock = () =>
  ({
    t: (message: string) => message,
  } as ITranslationService);
