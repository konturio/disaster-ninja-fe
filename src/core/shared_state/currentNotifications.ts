import { createAtom } from '@reatom/core';

export type NotificationType = 'error' | 'warning' | 'info';

interface NotificationMessage {
  title: string;
  text?: string;
}
interface Notification {
  type: NotificationType;
  message: NotificationMessage;
  lifetimeSec: number;
}

export const currentNotificationAtom = createAtom(
  {
    showNotification: (
      type: NotificationType,
      message: NotificationMessage,
      lifetimeSec: number,
    ) => ({ type, message, lifetimeSec }),
    _removeNotification: (id: number) => id,
  },
  ({ onAction, schedule, create }, state: Notification[] = []) => {
    onAction('showNotification', ({ type, message, lifetimeSec }) => {
      const id = performance.now();
      state[id] = { type, message, lifetimeSec };
      schedule((dispatch) => {
        setTimeout(() => {
          dispatch(create('_removeNotification', id));
        }, lifetimeSec * 1000);
      });
    });

    onAction('_removeNotification', (id) => delete state[id]);
    return { ...state };
  },
);
