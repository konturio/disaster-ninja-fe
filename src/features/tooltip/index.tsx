import { useAtom } from '@reatom/react';
import { useEffect } from 'react';
import { AppFeature } from '~core/auth/types';
import { currentTooltipAtom } from '~core/shared_state/currentTooltip';
import { Tooltip } from './Tooltip/Tooltip';
import type { FeatureInterface } from '~utils/metrics/lazyFeatureLoad';

function PopupTooltip({ reportReady }: { reportReady: () => void }) {
  const [tooltip, { resetCurrentTooltip }] = useAtom(currentTooltipAtom);

  useEffect(() => {
    reportReady();
  }, []);

  return <Tooltip properties={tooltip} closeTooltip={resetCurrentTooltip} />;
}

/* eslint-disable react/display-name */

export const featureInterface: FeatureInterface = {
  affectsMap: false,
  id: AppFeature.TOOLTIP,
  rootComponentWrap(reportReady, addedProps) {
    return () => <PopupTooltip reportReady={reportReady} />;
  },
};
