import { useAtom } from '@reatom/react';
import { currentTooltipAtom } from '~core/shared_state/currentTooltip';
import {
  CSSTransitionWrapper,
  fadeClassNames,
} from '~components/CssTransitionWrapper/CssTransitionWrapper';
import { Tooltip } from './Tooltip/Tooltip';

export function PopupTooltip() {
  const [tooltip, { resetCurrentTooltip }] = useAtom(currentTooltipAtom);
  return (
    <CSSTransitionWrapper in={Boolean(tooltip)} timeout={300} classNames={fadeClassNames}>
      {(transitionRef) => (
        <Tooltip
          transitionRef={transitionRef}
          properties={tooltip}
          closeTooltip={resetCurrentTooltip}
        />
      )}
    </CSSTransitionWrapper>
  );
}
