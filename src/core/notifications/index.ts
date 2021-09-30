import { currentNotificationAtom } from '~core/shared_state';

export function showWarning(message: string, lifetimeSec?: number) {
  currentNotificationAtom.showNotification('warning', message, lifetimeSec);
}

export function showError(message: string, lifetimeSec?: number) {
  currentNotificationAtom.showNotification('error', message, lifetimeSec);
}

export function showInfo(message: string, lifetimeSec?: number) {
  currentNotificationAtom.showNotification('info', message, lifetimeSec);
}
