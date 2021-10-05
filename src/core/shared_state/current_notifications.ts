import { createAtom } from '@reatom/core';

export type NotificationType = 'error' | 'warning' | 'info';
interface Notification {
  type: NotificationType;
  message: string;
  lifetimeSec: number;
}

export const currentNotificationAtom = createAtom(
  {
    showNotification: (
      type: NotificationType,
      message: string,
      lifetimeSec = 10,
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
