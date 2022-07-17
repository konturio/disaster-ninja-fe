import { useAtom } from '@reatom/react';
import { useEffect } from 'react';
import { AppFeature } from '~core/auth/types';
import { toastsStackAtom } from './atoms/toastsStackAtom';
import { ToastGroup } from './components/ToastGroup/ToastGroup';
import type { FeatureInterface } from '~utils/metrics/lazyFeatureLoad';

export function NotificationToast({
  reportReady,
}: {
  reportReady: () => void;
}) {
  const [toasts] = useAtom(toastsStackAtom);
  useEffect(() => reportReady(), []);

  return <ToastGroup toasts={toasts} />;
}
/* eslint-disable react/display-name */
export const featureInterface: FeatureInterface = {
  affectsMap: false,
  id: AppFeature.TOASTS,
  rootComponentWrap(reportReady, addedProps) {
    return () => <NotificationToast reportReady={reportReady} />;
  },
};
