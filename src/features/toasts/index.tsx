import { useAtom } from '@reatom/react';
import { toastsStackAtom } from './atoms/toastsStackAtom';
import { ToastGroup } from './components/ToastGroup/ToastGroup';

export function NotificationToast() {
  const [toasts] = useAtom(toastsStackAtom);

  return <ToastGroup toasts={toasts} />;
}
