import { createAtom } from '@reatom/core';

export type NotificationType = 'error' | 'warning' | 'info';

interface NotificationMessage {
  title: string;
  text?: string;
}
export interface Notification {
  id: number;
  type: NotificationType;
  message: NotificationMessage;
  lifetimeSec: number;
  onClose: () => void;
}

export const currentNotificationAtom = createAtom(
  {
    showNotification: (
      type: NotificationType,
      message: NotificationMessage,
      lifetimeSec: number,
    ) => ({ type, message, lifetimeSec }),
    removeNotification: (id: number) => id,
  },
  ({ onAction, schedule, create }, state: Notification[] = []) => {
    onAction('showNotification', ({ type, message, lifetimeSec }) => {
      const id = performance.now();
      const onClose = () =>
        currentNotificationAtom.removeNotification.dispatch(id);
      state = [...state, { id, type, message, lifetimeSec, onClose }];
      schedule((dispatch) => {
        setTimeout(onClose, lifetimeSec * 1000);
      });
    });

    onAction(
      'removeNotification',
      (idToDelete) => (state = state.filter(({ id }) => id !== idToDelete)),
    );
    return [...state];
  },
);
