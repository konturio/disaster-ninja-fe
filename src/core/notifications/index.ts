import { currentNotificationAtom } from '~core/shared_state';

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

  error(message: string, lifetimeSec?: number) {
    currentNotificationAtom.showNotification(
      'error',
      message,
      lifetimeSec || this.defaultLifetimeSec,
    );
  }

  warning(message: string, lifetimeSec?: number) {
    currentNotificationAtom.showNotification(
      'warning',
      message,
      lifetimeSec || this.defaultLifetimeSec,
    );
  }

  info(message: string, lifetimeSec?: number) {
    currentNotificationAtom.showNotification(
      'info',
      message,
      lifetimeSec || this.defaultLifetimeSec,
    );
  }
}
