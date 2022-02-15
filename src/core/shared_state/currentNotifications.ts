import { nanoid } from 'nanoid';
import { createAtom } from '~utils/atoms';

export type NotificationType = 'error' | 'warning' | 'info';

interface NotificationMessage {
  title: string;
  description?: string;
}
export interface Notification {
  id: string;
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
    removeNotification: (id: string) => id,
  },
  ({ onAction, schedule, create }, state: Notification[] = []) => {
    onAction('showNotification', ({ type, message, lifetimeSec }) => {
      const id = nanoid(4);
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
  '[Shared state] currentNotificationAtom',
);
