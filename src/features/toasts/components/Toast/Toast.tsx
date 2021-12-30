import { Card, Text } from '@k2-packages/ui-kit';
import { Notification } from '~core/shared_state/currentNotifications';
import clsx from 'clsx';
import styles from './Toast.module.css';
import closeCross from '../../icons/close_alert.svg';
import errorAlert from '../../icons/error_alert.svg';
import warningAlert from '../../icons/warning_alert.svg';
import infogAlert from '../../icons/info_alert.svg';
import { useMemo } from 'react';

export function Toast({
  notification,
  nodeRef,
}: {
  notification: Notification;
  nodeRef: React.MutableRefObject<null>;
}) {
  function close() {
    notification.onClose();
  }

  const iconType = useMemo(() => {
    if (notification.type === 'warning') return warningAlert;
    if (notification.type === 'info') return infogAlert;
    return errorAlert;
  }, [notification]);

  return (
    <div className={clsx(styles.container)} ref={nodeRef}>
      <Card
        inline={true}
        className={clsx(styles.toast, styles['toast-' + notification.type])}
      >
        <div className={clsx(styles.content)}>
          <img src={iconType} className={clsx(styles.icon)} />
          <Text type="short-l">
            <span className={clsx(styles.text)}>
              {notification.message.description || notification.message.title}
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
