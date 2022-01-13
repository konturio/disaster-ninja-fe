import { useAtom } from "@reatom/react";
import { сurrentTooltipAtom } from "~core/shared_state/сurrentTooltip";
import { Tooltip } from "./Tooltip/Tooltip";

export function PopupTooltip() {
  const [tooltip, { resetCurrentTooltip }] = useAtom(сurrentTooltipAtom)
  return (<Tooltip info={tooltip} closeTooltip={resetCurrentTooltip} />)
}
