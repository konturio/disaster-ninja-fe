import { useAtom } from '@reatom/react';
import { AppFeature } from '~core/auth/types';
import { featureStatus } from '~core/featureStatus';
import { toastsStackAtom } from './atoms/toastsStackAtom';
import { ToastGroup } from './components/ToastGroup/ToastGroup';

let markedReady = false;

export function NotificationToast() {
  const [toasts] = useAtom(toastsStackAtom);
  if (!markedReady) {
    featureStatus.markReady(AppFeature.TOASTS);
    markedReady = true;
  }

  return <ToastGroup toasts={toasts} />;
}
