import { useAtom } from '@reatom/react';
import { useEffect } from 'react';
import { AppFeature } from '~core/auth/types';
import { currentTooltipAtom } from '~core/shared_state/currentTooltip';
import { Tooltip } from './Tooltip/Tooltip';
import type { FeatureInterface } from '~utils/hooks/useAppFeature';

function PopupTooltip({ reportReady }: { reportReady: () => void }) {
  const [tooltip, { resetCurrentTooltip }] = useAtom(currentTooltipAtom);

  useEffect(() => {
    reportReady();
  }, []);

  return <Tooltip properties={tooltip} closeTooltip={resetCurrentTooltip} />;
}

export const featureInterface: FeatureInterface = {
  affectsMap: false,
  id: AppFeature.TOASTS,
  RootComponent: PopupTooltip,
};
