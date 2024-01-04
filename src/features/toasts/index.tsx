import { useAtom } from '@reatom/react-v2';
import { toastsStackAtom } from './atoms/toastsStackAtom';
import { ToastGroup } from './components/ToastGroup/ToastGroup';

export function NotificationToast() {
  const [toasts] = useAtom(toastsStackAtom);
  return <ToastGroup toasts={toasts} />;
}
