import { Text, Card } from '@k2-packages/ui-kit';
import { Notification } from '~core/shared_state/currentNotifications';
import clsx from 'clsx';
import styles from './Toast.module.css';
import closeCross from '../../icons/close_alert.svg';
import errorAlert from '../../icons/error_alert.svg';
import warningAlert from '../../icons/warning_alert.svg';
import infogAlert from '../../icons/info_alert.svg';

export function Toast({ notification }: { notification: Notification }) {
  function close() {
    notification.onClose();
  }

  function iconType() {
    if (notification.type === 'warning') return warningAlert;
    if (notification.type === 'info') return infogAlert;
    return errorAlert;
  }

  return (
    <div className={clsx(styles.container)}>
      <Card
        inline={true}
        className={clsx(styles.toast, styles['toast-' + notification.type])}
      >
        <div className={clsx(styles.content)}>
          <img src={iconType()} className={clsx(styles.icon)} />
          <Text type="short-l">
            <span className={clsx(styles.text)}>
              {notification.message.title}
            </span>
          </Text>
          <img
            src={closeCross}
            className={clsx(styles.closeCross)}
            onClick={close}
          />
        </div>
      </Card>
    </div>
  );
}
