import { currentNotificationAtom } from '~core/shared_state/currentNotifications';
import type { NotificationMessage } from '~core/types/notification';
import type { AppStore } from '..';

export class NotificationService {
  store: AppStore;
  constructor(store: AppStore) {
    this.store = store;
  }
  private static instance: NotificationService;
  private defaultLifetimeSec = 10;

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      throw new Error('You have to initialize api client first!');
    } else {
      return NotificationService.instance;
    }
  }

  error(message: NotificationMessage, lifetimeSec?: number) {
    this.store.dispatch(
      currentNotificationAtom.showNotification(
        'error',
        message,
        lifetimeSec || this.defaultLifetimeSec,
      ),
    );
  }

  warning(message: NotificationMessage, lifetimeSec?: number) {
    this.store.dispatch(
      currentNotificationAtom.showNotification(
        'warning',
        message,
        lifetimeSec || this.defaultLifetimeSec,
      ),
    );
  }

  info(message: NotificationMessage, lifetimeSec?: number) {
    this.store.dispatch(
      currentNotificationAtom.showNotification(
        'info',
        message,
        lifetimeSec || this.defaultLifetimeSec,
      ),
    );
  }
}
