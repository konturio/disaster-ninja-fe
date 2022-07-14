import { useAtom } from '@reatom/react';
import { useEffect } from 'react';
import { AppFeature } from '~core/auth/types';
import { toastsStackAtom } from './atoms/toastsStackAtom';
import { ToastGroup } from './components/ToastGroup/ToastGroup';
import type { FeatureInterface } from '~utils/hooks/useAppFeature';

export function NotificationToast({
  reportReady,
}: {
  reportReady: () => void;
}) {
  const [toasts] = useAtom(toastsStackAtom);
  useEffect(() => reportReady(), []);

  return <ToastGroup toasts={toasts} />;
}
export const featureInterface: FeatureInterface = {
  affectsMap: false,
  id: AppFeature.TOASTS,
  RootComponent: NotificationToast,
};
