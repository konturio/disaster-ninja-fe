import { Card, Text } from '@konturio/ui-kit';
import clsx from 'clsx';
import { useMemo } from 'react';
import { Alarm24, Close24, Error24, Info24, Finish24 } from '@konturio/default-icons';
import styles from './Toast.module.css';
import type { Notification } from '~core/shared_state/currentNotifications';

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

  const icon = useMemo(() => {
    if (notification.type === 'warning') return <Alarm24 />;
    if (notification.type === 'info') return <Info24 />;
    if (notification.type === 'success') return <Finish24 />;
    return <Error24 />;
  }, [notification]);

  return (
    <div className={clsx(styles.container)} ref={nodeRef}>
      <Card
        inline={true}
        className={clsx(styles.toast, styles['toast-' + notification.type])}
      >
        <div className={clsx(styles.content)}>
          <div className={clsx(styles.icon)}>{icon}</div>
          <Text type="short-l">
            <span className={clsx(styles.text)}>
              {notification.message.description || notification.message.title}
            </span>
          </Text>
          <div className={styles.closeButtonContainer} onClick={close}>
            <Close24 />
          </div>
        </div>
      </Card>
    </div>
  );
}
