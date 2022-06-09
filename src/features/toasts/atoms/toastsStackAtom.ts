import { createAtom } from '~utils/atoms';
import { currentNotificationAtom } from '~core/shared_state';
import type { Notification } from '~core/shared_state/currentNotifications';

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
