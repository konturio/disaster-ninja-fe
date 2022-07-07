import { useAtom } from '@reatom/react';
import { AppFeature } from '~core/auth/types';
import { featureStatus } from '~core/featureStatus';
import { currentTooltipAtom } from '~core/shared_state/currentTooltip';
import { Tooltip } from './Tooltip/Tooltip';

let markedReady = false;

export function PopupTooltip() {
  const [tooltip, { resetCurrentTooltip }] = useAtom(currentTooltipAtom);

  if (!markedReady) {
    featureStatus.markReady(AppFeature.TOOLTIP);
    markedReady = true;
  }

  return <Tooltip properties={tooltip} closeTooltip={resetCurrentTooltip} />;
}
