import { createAtom } from '@reatom/core';
import { Notification } from '~core/shared_state/currentNotifications';
import { currentNotificationAtom } from '~core/shared_state';

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
);
