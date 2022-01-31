import { useAtom } from '@reatom/react';
import { currentTooltipAtom } from '~core/shared_state/сurrentTooltip';
import { Tooltip } from './Tooltip/Tooltip';

export function PopupTooltip() {
  const [tooltip, { resetCurrentTooltip }] = useAtom(currentTooltipAtom);
  return <Tooltip properties={tooltip} closeTooltip={resetCurrentTooltip} />;
}
