import { createAtom } from '~core/store/atoms';
import { currentNotificationAtom } from '~core/shared_state';
import type { Notification } from '~core/notifications/atoms/currentNotifications';

export const toastsStackAtom = createAtom(
  {
    currentNotificationAtom,
  },
  ({ get }, state: Notification[] = []) => {
    const toastsOrder = get('currentNotificationAtom');
    if (Array.isArray(toastsOrder)) {
      return [...toastsOrder].reverse();
    }
    return state;
  },
  'toastsStackAtom',
);
