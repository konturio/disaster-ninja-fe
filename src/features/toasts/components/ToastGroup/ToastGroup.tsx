import clsx from 'clsx';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Notification } from '~core/shared_state/currentNotifications';
import { Toast } from '../Toast/Toast';
import styles from './ToastGroup.module.css';

export function ToastGroup({ toasts }: { toasts: Notification[] }) {
  return (
    <TransitionGroup className={clsx(styles.toasts)}>
      {toasts.map((t) => (
        <CSSTransition
          key={t.id}
          timeout={500}
          classNames={{
            enter: styles.enter,
            enterActive: styles.enterActive,
            exit: styles.toastExit,
          }}
        >
          <Toast notification={t} />
        </CSSTransition>
      ))}
    </TransitionGroup>
  );
}
