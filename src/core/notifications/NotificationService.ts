import { currentNotificationAtom } from '~core/shared_state/currentNotifications';
import type { NotificationMessage } from '~core/types/notification';

export class NotificationService {
  private static instance: NotificationService;
  private defaultLifetimeSec = 10;
  private constructor() {
    /* noop */
  }

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      throw new Error('You have to initialize api client first!');
    } else {
      return NotificationService.instance;
    }
  }

  public static init() {
    NotificationService.instance = new NotificationService();
  }

  error(message: NotificationMessage, lifetimeSec?: number) {
    currentNotificationAtom.showNotification.dispatch(
      'error',
      message,
      lifetimeSec || this.defaultLifetimeSec,
    );
  }

  warning(message: NotificationMessage, lifetimeSec?: number) {
    currentNotificationAtom.showNotification.dispatch(
      'warning',
      message,
      lifetimeSec || this.defaultLifetimeSec,
    );
  }

  info(message: NotificationMessage, lifetimeSec?: number) {
    currentNotificationAtom.showNotification.dispatch(
      'info',
      message,
      lifetimeSec || this.defaultLifetimeSec,
    );
  }

  success(message: NotificationMessage, lifetimeSec?: number) {
    currentNotificationAtom.showNotification.dispatch(
      'success',
      message,
      lifetimeSec || this.defaultLifetimeSec,
    );
  }
}
